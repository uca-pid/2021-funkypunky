package com.funkypunky.resource.impl;

import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.repository.EntrenamientoRepository;
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

	@GetMapping("/entrnamientoByUser")
	@ResponseBody
	public Collection<Entrenamiento> getEntrenamientoByuser(@RequestParam Long user_id) {
		return entrenamientoRepository.findByUser(user_id);
	}

	@GetMapping("/getEntrnamientos")
	@ResponseBody
	public Collection<Entrenamiento> getEntrenamientoByuser() {
		return entrenamientoRepository.findAll();
	}
}