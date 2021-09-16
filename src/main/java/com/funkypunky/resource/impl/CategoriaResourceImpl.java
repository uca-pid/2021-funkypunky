package com.funkypunky.resource.impl;

import com.funkypunky.domain.Categoria;
import com.funkypunky.repository.CategoriaRepository;
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
	private CategoriaRepository categoriaRepository;

	@GetMapping("/getCategorias")
	public Collection<Categoria> getEntrenamientoByuser() {
		return categoriaRepository.findAll();
	}
	
}