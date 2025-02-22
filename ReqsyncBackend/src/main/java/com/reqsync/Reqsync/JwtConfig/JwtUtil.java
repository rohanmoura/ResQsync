package com.reqsync.Reqsync.JwtConfig;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private String SECRET_KEY = "782d78511e6bc2b43b76e3891335ec8b26cb5b3fa81adae0a9b6bba2e781a534574290c416bdb3ea82811a58429d4fe2f3696cef00b20bee9662afdee787882681eafd2768e0441b9ca3ecda527b9eec49d585d3051b8f1e062a79551181e96afe36a65b6d1c8f3d074e09c98851e1d00a5bf4a38feb268678b09418e52c3e29be444b8c9b57a5f84b31516f4f2e0a764e5b75494846f063fca1cd6d8cba9221ff835118e42de31fcf6a6537fa3a4ab3775f6ae2e4c8900c8c41e22b74d6c964d3675a1fdcb1caa038bf570264aa444e7621539d61c4db51eb54bf93a4309e133e96141e003fbeefffefedacbfe61d160adb834a3bc7afb37836d4fe18fbc6b1";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // Coverting the secret key with hmac algo
    }

    public String extractUsername(String token) { // this will take the jwt token and extract the claims and return the
                                                  // subject means the username or email
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails user) { // We are
                                                   // generating
                                                   // token here
                                                   // while
                                                   // returning
        // the claims
    	
    	
        Map<String, Object> claims = new HashMap<>(); // This hashmap will stores our claims
        java.util.Collection<? extends GrantedAuthority> userRole = user.getAuthorities(); //The Role::getRole is a short hand method to call a function of a class
       claims.put("roles",userRole.stream().map(GrantedAuthority :: getAuthority).toList());
        return createToken(claims, user); // retruning the create token method with claims
    }

    private String createToken(Map<String, Object> claims, UserDetails user) {
        return Jwts.builder() // building a jwt token things like the unique id of the user , time to expire
                .claims(claims)
                .subject(user.getUsername()) // unique id which is email
                .header().empty().add("typ", "JWT") // header includes the token type and algo name
                .and()
                .issuedAt(new Date(System.currentTimeMillis())) // isse time
                .expiration(new Date(System.currentTimeMillis() + 1 * 60 * 1000)) // 5 minutes expiration time
                .signWith(getSigningKey()) // the secret key
                .compact();
    }

    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

}