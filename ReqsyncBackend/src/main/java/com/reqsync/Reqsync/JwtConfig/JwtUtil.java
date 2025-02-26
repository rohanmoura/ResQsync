package com.reqsync.Reqsync.JwtConfig;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

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
        java.util.Collection<? extends GrantedAuthority> userRole = user.getAuthorities(); // The Role::getRole is a
                                                                                           // short hand method to call
                                                                                           // a function of a class
        claims.put("roles", userRole.stream().map(GrantedAuthority::getAuthority).toList());
        return createToken(claims, user); // retruning the create token method with claims
    }

    private String createToken(Map<String, Object> claims, UserDetails user) {
        return Jwts.builder() // building a jwt token things like the unique id of the user , time to expire
                .claims(claims)
                .subject(user.getUsername()) // unique id which is email
                .header().empty().add("typ", "JWT") // header includes the token type and algo name
                .and()
                .issuedAt(new Date(System.currentTimeMillis())) // isse time
                .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 5 minutes expiration time
                .signWith(getSigningKey()) // the secret key
                .compact();
    }

    public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

}