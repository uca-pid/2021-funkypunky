package com.funkypunky.resource.impl;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Editable;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.EntrenamientoServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Collection;

@RestController
@RequestMapping("/entrenamiento")
@CrossOrigin(origins = "*")
public class EntrenamientoResourceImpl {

	private static Logger log = LoggerFactory.getLogger(EntrenamientoResourceImpl.class);

	@Autowired
	private EntrenamientoRepository entrenamientoRepository;

	@Autowired
	private EntrenamientoServiceImpl entrenamientoService;

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private CategoriaServiceImpl categoriaService;

	@GetMapping("/entrenamientoByUser")
	@ResponseBody
	public Collection<Entrenamiento> getEntrenamientoByuser(@RequestParam String user_email) {
		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}
		return entrenamientoRepository.findByUser(user);
	}

	@PostMapping(value = "/agregarEntrenamiento", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> register(@RequestParam Long 		id_categoria,
										   @RequestParam String 	descripcion,
										   @RequestParam Integer	duracion,
										   @RequestParam String 	usuario,
										   @RequestParam String fecha) {
		if(!userService.findByEmail(usuario).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		Timestamp start_date = Timestamp.valueOf(fecha);
		JSONObject jsonObject = new JSONObject();

		try {
			Entrenamiento entrenamiento = new Entrenamiento();
			entrenamiento.setDescription(descripcion);
			entrenamiento.setStartTime(start_date);
			entrenamiento.setAssignedUser(userService.findByEmail(usuario).get());
			entrenamiento.setCategoria(categoriaService.findById(id_categoria).get());
			entrenamiento.setDuracion(duracion);

			Entrenamiento savedEntrenamiento = entrenamientoRepository.saveAndFlush(entrenamiento);
			jsonObject.put("message ", savedEntrenamiento.getDescription() + " saved succesfully");
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

	@PostMapping(value = "/eliminarEntrenamiento", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> register(	@RequestParam Long id) {
		JSONObject jsonObject = new JSONObject();
		if(!entrenamientoService.findById(id).isPresent()){
			return new ResponseEntity<>("Entrenamiento with ID "+ id +" does not exist", HttpStatus.BAD_REQUEST);
		}
		try {
			entrenamientoRepository.deleteById(id);
			jsonObject.put("message", "Entrenamiento deleted succesfully");
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