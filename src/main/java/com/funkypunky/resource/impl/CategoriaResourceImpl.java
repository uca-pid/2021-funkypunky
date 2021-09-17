package com.funkypunky.resource.impl;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.User;
import com.funkypunky.repository.CategoriaRepository;
import com.funkypunky.service.impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaResourceImpl {

	private static Logger log = LoggerFactory.getLogger(CategoriaResourceImpl.class);

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private CategoriaRepository categoriaRepository;

	@GetMapping("/categoriaByUser")
	@ResponseBody
	public Collection<Categoria> getCategoriaByuser(@RequestParam String user_email) {
		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}
		return categoriaRepository.findByUser(user);
	}
	
}