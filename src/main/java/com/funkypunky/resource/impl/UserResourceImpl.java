package com.funkypunky.resource.impl;

import com.funkypunky.config.JwtTokenProvider;
import com.funkypunky.domain.User;
import com.funkypunky.repository.RoleRepository;
import com.funkypunky.repository.UserRepository;
import com.funkypunky.utils.ConstantUtils;
import com.funkypunky.utils.EmailServiceImpl;
import com.funkypunky.utils.PasswordManager;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserResourceImpl {

	private static Logger log = LoggerFactory.getLogger(UserResourceImpl.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenProvider tokenProvider;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private EmailServiceImpl emailService;

	@PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> register(@RequestBody User user) {
		log.info("UserResourceImpl : register");
		JSONObject jsonObject = new JSONObject();
		try {
			user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
			user.setRole(roleRepository.findByName(ConstantUtils.USER.toString()));
			User savedUser = userRepository.saveAndFlush(user);
			jsonObject.put("message", savedUser.getName() + " saved succesfully");
			return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
		} catch (JSONException e) {
			try {
				jsonObject.put("exception", e.getMessage());
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping(value = "/updateUserPw", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> updateUserPw(@RequestBody User user) {
		log.info("UserResourceImpl : updateUserPw");
		JSONObject jsonObject = new JSONObject();
		try {
			User updatedUser = userRepository.findByEmail(user.getEmail());
			String password = PasswordManager.generateRandomPassword(8);
			emailService.sendSimpleMessage(updatedUser.getEmail(),"Contraseña Cambiada - 2FIT","Su nueva contraseña es: " + password);
			updatedUser.setPassword(new BCryptPasswordEncoder().encode(password));
			log.info("New updated password : " + password);
			User savedUser = userRepository.saveAndFlush(updatedUser);
			jsonObject.put("message", savedUser.getName() + " saved succesfully");
			return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
		} catch (JSONException e) {
			try {
				jsonObject.put("exception", e.getMessage());
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
		}
	}

	@PostMapping(value = "/authenticate", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> authenticate(@RequestBody User user) {
		log.info("UserResourceImpl : authenticate");
		JSONObject jsonObject = new JSONObject();
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
			if (authentication.isAuthenticated()) {
				String email = user.getEmail();
				jsonObject.put("name", authentication.getName());
				jsonObject.put("authorities", authentication.getAuthorities());
				jsonObject.put("token", tokenProvider.createToken(email, userRepository.findByEmail(email).getRole()));
				return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
			}
		} catch (JSONException e) {
			try {
				jsonObject.put("exception", e.getMessage());
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
		}
		return null;
	}

	@GetMapping("/getTareas")
	public User getTareas(){
		return userRepository.findByEmail("test@admin.com");
	}

}