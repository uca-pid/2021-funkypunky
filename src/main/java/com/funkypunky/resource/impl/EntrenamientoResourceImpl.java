package com.funkypunky.resource.impl;

import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.service.impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/entrenamiento")
@CrossOrigin(origins = "*")
public class EntrenamientoResourceImpl {

	private static Logger log = LoggerFactory.getLogger(EntrenamientoResourceImpl.class);

	@Autowired
	private EntrenamientoRepository entrenamientoRepository;

	@Autowired
	private UserServiceImpl userService;

	@GetMapping("/entrenamientoByUser")
	@ResponseBody
	public Collection<Entrenamiento> getEntrenamientoByuser(@RequestParam String user_email) {
		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}
		return entrenamientoRepository.findByUser(user);
	}

	@GetMapping("/getEntrenamientos")
	@ResponseBody
	public Collection<Entrenamiento> getEntrenamientos() {
		return entrenamientoRepository.findAll();
	}
}