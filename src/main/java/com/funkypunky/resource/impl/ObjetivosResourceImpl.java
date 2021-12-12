package com.funkypunky.resource.impl;

import com.funkypunky.domain.MetaTotal;
import com.funkypunky.domain.Objetivo;
import com.funkypunky.domain.User;
import com.funkypunky.repository.ObjetivoRepository;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.ObjetivoServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

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
	private CategoriaServiceImpl categoriaService;

	@Autowired
	private MetricasResourceImpl metricasResource;

	@Autowired
	private ObjetivoRepository objetivoRepository;

	@GetMapping("/getProgresoObjetivo")
	@ResponseBody
	public List<MetaTotal> getObjetivoByUserAndPeriod(@RequestParam String user_email, @RequestParam String yearMonthPeriodStart, @RequestParam String yearMonthPeriodEnd) {

		User user = null;
		YearMonth yearMonthStart = YearMonth.parse(yearMonthPeriodStart);
		YearMonth yearMonthEnd = YearMonth.parse(yearMonthPeriodEnd);

		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}
		float acum_objetivo = 0f;
		float acum_objetivo_logrado = 0f;
		List<MetaTotal> period_sum = new ArrayList<>();

		YearMonth actualMonth = yearMonthStart;
		MetaTotal metaTotal = new MetaTotal();

		do{
			Collection<Objetivo> objetivo = objetivoService.findByUserAndPeriodRange(user, actualMonth, actualMonth);
			for (Objetivo objetivo1 : objetivo) {
				acum_objetivo_logrado += metricasResource.getCaloriesInMonthAndCategory(user_email,actualMonth,objetivo1.getCategoria());
				acum_objetivo += objetivo1.getTargetCaloryCount();
			}
			metaTotal.setProgressCalory(acum_objetivo_logrado);
			metaTotal.setTargetCaloryCount(acum_objetivo);
			metaTotal.setPeriod(actualMonth);
			period_sum.add(metaTotal);

			actualMonth = actualMonth.plusMonths(1);
			metaTotal = new MetaTotal();
			acum_objetivo = 0;
			acum_objetivo_logrado = 0;
		} while(!yearMonthEnd.plusMonths(1).equals(actualMonth));

		return period_sum;
	}

	@GetMapping("/getProgresoMes")
	@ResponseBody
	public Collection<Objetivo> getObjetivoByUserAndYearMonth(@RequestParam String user_email, @RequestParam String yearMonth) {

		User user = null;
		YearMonth yearMonth1 = YearMonth.parse(yearMonth);

		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		Collection<Objetivo> objetivo = objetivoService.findByUserAndYearMonth(user, yearMonth1);

		for(Objetivo objetivo1: objetivo){
			YearMonth objectiveYearMonth = objetivo1.getPeriod();
			objetivo1.setProgressCalory(metricasResource.getCaloriesInMonthAndCategory(user_email, objectiveYearMonth, objetivo1.getCategoria()));
		}

		return objetivo;
	}


	@GetMapping("/getHistorialObjetivo")
	@ResponseBody
	public Collection<Objetivo> getObjetivoHistoryByUser(@RequestParam String user_email) {
		User user = null;

		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		return objetivoService.findHistoryByUser(user).stream().sorted(Comparator.comparing(Objetivo::getPeriod)).collect(Collectors.toList());
	}

	@PostMapping(value = "/agregarObjetivo", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> agregarObjetivo(@RequestBody Map<String, Object> payload) {

		Long id = new Long((Integer) payload.get("id_categoria"));
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
			objetivo.setCategoria(categoriaService.findById(id).get());
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

		Long id = new Long((Integer) payload.get("id_categoria"));
		Float objetivoCalorico = new Float ((Integer) payload.get("objetivo"));
		String usuario = (String) payload.get("usuario");
		YearMonth period = YearMonth.parse( (String) payload.get("periodo"));

		if(!userService.findByEmail(usuario).isPresent()){
			return new ResponseEntity<>("User does not exist", HttpStatus.BAD_REQUEST);
		}

		JSONObject jsonObject = new JSONObject();

		User user = userService.findByEmail(usuario).orElse(new User());

		try {
			Objetivo objetivo = objetivoService.findByUserAndPeriodAndCategory(user,period,categoriaService.findById(id).get()).get();
			if(usuario != null) objetivo.setUser(user);
			if(period != null) objetivo.setPeriod(period);
			if(period != null) objetivo.setCategoria(categoriaService.findById(id).get());
			if(objetivoCalorico != null) objetivo.setTargetCaloryCount(objetivoCalorico);

			Objetivo savedObjetivo = objetivoRepository.saveAndFlush(objetivo);
			jsonObject.put("objetivo del usuario: ", savedObjetivo.getUser() + " saved succesfully");
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

		Long id = new Long((Integer) payload.get("id"));

		JSONObject jsonObject = new JSONObject();

		try {
			String response = objetivoService.deleteById(id);

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