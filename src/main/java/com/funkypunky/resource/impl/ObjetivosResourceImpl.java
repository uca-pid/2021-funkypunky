package com.funkypunky.resource.impl;

import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.Objetivo;
import com.funkypunky.domain.User;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.repository.ObjetivoRepository;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.EntrenamientoServiceImpl;
import com.funkypunky.service.impl.ObjetivoServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import lombok.Getter;
import lombok.Setter;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.YearMonth;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/objetivos")
@CrossOrigin(origins = "*")
public class ObjetivosResourceImpl {

	private static Logger log = LoggerFactory.getLogger(ObjetivosResourceImpl.class);

	@Autowired
	private ObjetivoServiceImpl objetivoService;

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private MetricasResourceImpl metricasResource;

	@Autowired
	private ObjetivoRepository objetivoRepository;

	@GetMapping("/getProgresoObjetivo")
	@ResponseBody
	public Objetivo getObjetivoByUserAndPeriod(@RequestParam String user_email, @RequestParam String yearMonthPeriod) {
		User user = null;
		YearMonth yearMonth = YearMonth.parse(yearMonthPeriod);

		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		Objetivo objetivo = objetivoService.findByUserAndPeriod(user,yearMonth).orElse(new Objetivo());
		objetivo.setProgressCalory(metricasResource.getCaloriesInRange(user_email,yearMonthPeriod,yearMonthPeriod).get(yearMonth));
		return objetivo;
	}

	@PostMapping(value = "/agregarObjetivo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> agregarObjetivo(@RequestBody Map<String, Object> payload) {

		Float objetivoCalorico = new Float ((Integer) payload.get("objetivo"));
		String usuario = (String) payload.get("usuario");
		YearMonth date = YearMonth.parse( (String) payload.get("periodo"));

		if(!userService.findByEmail(usuario).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		JSONObject jsonObject = new JSONObject();

		try {
			Objetivo objetivo = new Objetivo();
			objetivo.setUser(userService.findByEmail(usuario).get());
			objetivo.setPeriod(date);
			objetivo.setTargetCaloryCount(objetivoCalorico);

			Objetivo savedObjetivo = objetivoRepository.saveAndFlush(objetivo);
			jsonObject.put("objetivo de: ", savedObjetivo.getUser() + " saved succesfully");
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

	@PostMapping(value = "/editarObjetivo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> editarObjetivo(@RequestBody Map<String, Object> payload) {

		Float objetivoCalorico = new Float ((Integer) payload.get("objetivo"));
		String usuario = (String) payload.get("usuario");
		YearMonth period = YearMonth.parse( (String) payload.get("periodo"));

		if(!userService.findByEmail(usuario).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		JSONObject jsonObject = new JSONObject();

		User user = userService.findByEmail(usuario).orElse(new User());

		try {
			Objetivo objetivo = objetivoService.findByUserAndPeriod(user,period).orElse(new Objetivo());
			if(usuario != null) objetivo.setUser(user);
			if(period != null) objetivo.setPeriod(period);
			if(objetivoCalorico != null) objetivo.setTargetCaloryCount(objetivoCalorico);

			Objetivo savedObjetivo = objetivoRepository.saveAndFlush(objetivo);
			jsonObject.put("objetivo de: ", savedObjetivo.getUser() + " saved succesfully");
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

	@PostMapping(value = "/eliminarObjetivo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> eliminarObjetivo(@RequestBody Map<String, Object> payload) {

		String usuario = (String) payload.get("usuario");
		YearMonth period = YearMonth.parse( (String) payload.get("periodo"));

		if(!userService.findByEmail(usuario).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		JSONObject jsonObject = new JSONObject();

		User user = userService.findByEmail(usuario).orElse(new User());

		try {
			String response = objetivoService.deleteByUserAndPeriod(user,period);

			jsonObject.put("objetivo de: ", response );
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