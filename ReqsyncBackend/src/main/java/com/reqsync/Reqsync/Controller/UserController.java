package com.reqsync.Reqsync.Controller;

import java.io.IOException;
import java.io.InputStream;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reqsync.Reqsync.Dto.UserProfileDto;
import com.reqsync.Reqsync.Dto.UserUpdateDto;
import com.reqsync.Reqsync.Service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAuthority('USER')")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUser() {
        Object user = userService.getUserInfo();
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping(value = "/update-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart("updateDto") @Valid @NotNull String updateDtoJson) throws IOException {

        // @RequestPart is used in Spring Boot when handling multipart/form-data
        // requests. It is specifically designed to handle file uploads along with other
        // form data.

        ObjectMapper objectMapper = new ObjectMapper();
        UserUpdateDto updateDto = objectMapper.readValue(updateDtoJson, UserUpdateDto.class);

        // Validate image if provided
        if (profilePicture != null && !profilePicture.isEmpty()) {
            if (!isValidImage(profilePicture)) {
                return ResponseEntity.badRequest().body("You can only upload images in PNG, JPG, or JPEG format.");
            }
        }

        UserProfileDto updatedProfile = userService.updateUserProfile(profilePicture, updateDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {
        userService.deleteUser();
        return ResponseEntity.ok("User deleted successfully!");
    }

    /**
     * Checks if the uploaded file is a valid image (both by extension and content).
     */
    private boolean isValidImage(MultipartFile file) throws IOException {
        // Validate extension
        String fileName = file.getOriginalFilename().toLowerCase();
        if (!(fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))) {
            return false;
        }

        // Validate actual content (MIME type check)
        try (InputStream inputStream = file.getInputStream()) {
            return ImageIO.read(inputStream) != null; // Returns null if not an image
        }
    }
}
