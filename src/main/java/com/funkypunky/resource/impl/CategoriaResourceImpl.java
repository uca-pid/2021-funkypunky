package com.funkypunky.resource.impl;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Editable;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.repository.CategoriaRepository;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaResourceImpl {

	private static Logger log = LoggerFactory.getLogger(CategoriaResourceImpl.class);

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private CategoriaServiceImpl categoriaService;

	@Autowired
	private CategoriaRepository categoriaRepository;

	@Autowired
	private EntrenamientoRepository entrenamientoRepository;

	@GetMapping("/categoriaByUser")
	@ResponseBody
	public Collection<Categoria> getCategoriaByuser(@RequestParam String user_email) {
		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}
		return categoriaRepository.findByUser(user);
	}

	@PostMapping(value = "/agregarCategoria", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> agregarCategoria(@RequestBody Map<String, Object> payload) {

		String user_mail = (String) payload.get("user_mail");
		Float calPerMin = new Float((Integer) payload.get("calPerMin"));
		String nombre = (String) payload.get("nombre");

		JSONObject jsonObject = new JSONObject();
		if(!userService.findByEmail(user_mail).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		try {
			Categoria categoria = new Categoria();
			categoria.setUser(userService.findByEmail(user_mail).get());
			categoria.setNombre(nombre);
			categoria.setIs_editable(Editable.EDITABLE);
			categoria.setCalPerMin(calPerMin);

			Categoria savedCategory = categoriaRepository.saveAndFlush(categoria);
			jsonObject.put("message", savedCategory.getNombre() + " saved succesfully");
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


	@PostMapping(value = "/editarCategoria", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> editarCategoria(@RequestBody Map<String, Object> payload) {
		JSONObject jsonObject = new JSONObject();

		Long id = new Long((Integer) payload.get("id"));
		Float calPerMin = new Float((Integer) payload.get("calPerMin"));
		String nombre = (String) payload.get("nombre");

		if(!categoriaService.findById(id).isPresent()){
			return new ResponseEntity<>("Categoria does not exist", HttpStatus.BAD_REQUEST);
		}

		try {
			Categoria categoria = categoriaService.findById(id).get();

			if(categoria.getIs_editable().equals(Editable.NOT_EDITABLE)){
				return new ResponseEntity<>("La categoria no es editable", HttpStatus.NOT_ACCEPTABLE);
			}

			if(nombre != null) categoria.setNombre(nombre);
			if(calPerMin != null) categoria.setCalPerMin(calPerMin);

			Categoria savedCategory = categoriaRepository.saveAndFlush(categoria);
			jsonObject.put("message", savedCategory.getNombre() + " updated succesfully");
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

	@PostMapping(value = "/eliminarCategoria", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> eliminarCategoria(@RequestBody Map<String, Object> payload) {
		Long id = new Long((Integer) payload.get("id"));
		JSONObject jsonObject = new JSONObject();
		if(!categoriaService.findById(id).isPresent()){
			return new ResponseEntity<>("Categoria with ID "+ id +" does not exist", HttpStatus.BAD_REQUEST);
		}

		try {
			Categoria categoria = categoriaService.findById(id).get();

			if(categoria.getIs_editable().equals(Editable.NOT_EDITABLE)){
				return new ResponseEntity<>("La categoria no es editable", HttpStatus.NOT_ACCEPTABLE);
			}
			entrenamientoRepository.deleteByCategoria(categoria);
			categoriaRepository.deleteById(id);

			jsonObject.put("message", "Categoria deleted succesfully");
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

	
}