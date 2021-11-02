package com.funkypunky.resource.impl;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Editable;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.repository.CategoriaRepository;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/metrics")
@CrossOrigin(origins = "*")
public class MetricasResourceImpl {

	private static Logger log = LoggerFactory.getLogger(MetricasResourceImpl.class);

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private CategoriaServiceImpl categoriaService;

	@Autowired
	private CategoriaRepository categoriaRepository;

	@Autowired
	private EntrenamientoRepository entrenamientoRepository;

	@GetMapping("/userCategoryBreakdown")
	@ResponseBody
	public Map<String,Float> getMetricByUserMonth(@RequestParam String user_email, @RequestParam String yearMonthStr) {

		YearMonth yearMonth = YearMonth.parse(yearMonthStr);
		Calendar cal = Calendar.getInstance();

		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		Collection<Entrenamiento> entrenamientos = entrenamientoRepository.findByUser(user);

		// Tomo los entrenamientos del usuario, tomo los del año y mes pedido y devuelvo un mapa con {Categoria: [lista de entrenamientos de esa categoria]}
		Map<Categoria,List<Entrenamiento>> categoria_cal = entrenamientos.stream().filter((entrenamiento -> {
			cal.setTimeInMillis(entrenamiento.getStartTime().getTime());
			return cal.get(Calendar.YEAR) == yearMonth.getYear() && (cal.get(Calendar.MONTH)+1) == yearMonth.getMonthValue();
		})).collect(Collectors.groupingBy(Entrenamiento::getCategoria));

		Map<String,Float> resultado = new HashMap<String,Float>();

		Float total_parcial = 0f;

		//Creo un mapa con {NombreCateogoria: SumatoriaDeCalorias}
		for(Categoria categoria: categoria_cal.keySet()){
			total_parcial = categoria_cal.get(categoria).stream().map(Entrenamiento::getCaloriasQuemadas).reduce(0f, Float::sum);
			resultado.put(categoria.getNombre(),total_parcial);
		}
		return resultado;
	}

	@GetMapping("/caloriesInRange")
	@ResponseBody
	public Map<YearMonth,Float> getCaloriesInRange(@RequestParam String user_email, @RequestParam String rangeStart, @RequestParam String rangeEnd) {

		YearMonth yearMonthStart = YearMonth.parse(rangeStart);
		YearMonth yearMonthEnd = YearMonth.parse(rangeEnd);

		Calendar cal = Calendar.getInstance();

		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		Collection<Entrenamiento> entrenamientos = entrenamientoRepository.findByUser(user);

		entrenamientos = entrenamientos.stream().sorted(Comparator.comparing(Entrenamiento::getStartTime)).collect(Collectors.toList());

		Collection<Entrenamiento> categoria_cal = entrenamientos.stream().filter((entrenamiento -> {
			cal.setTimeInMillis(entrenamiento.getStartTime().getTime());
			return cal.get(Calendar.YEAR) >= yearMonthStart.getYear() && (cal.get(Calendar.MONTH)+1) >= yearMonthStart.getMonthValue()
					&& cal.get(Calendar.YEAR) <= yearMonthEnd.getYear() && (cal.get(Calendar.MONTH)+1) <= yearMonthEnd.getMonthValue();
		})).collect(Collectors.toList());


		Map<YearMonth,Float> resultado = new HashMap<YearMonth,Float>();

		//Completo el hashmap resultado con {AñoMes:caloriasTot}
		for(Entrenamiento entrenamiento: categoria_cal){
			cal.setTimeInMillis(entrenamiento.getStartTime().getTime());
			YearMonth mes = YearMonth.of(cal.get(Calendar.YEAR),cal.get(Calendar.MONTH)+1);

			resultado.computeIfPresent(mes, (periodo,caloriasTot) -> caloriasTot + entrenamiento.getCaloriasQuemadas());
			resultado.putIfAbsent(mes, entrenamiento.getCaloriasQuemadas());
		}

		return resultado;
	}


	public Float getCaloriesInMonthAndCategory(String user_email, YearMonth objectiveYearMonth1, Categoria categoria) {
		User user = null;
		if (userService.findByEmail(user_email).isPresent()) {
			user = userService.findByEmail(user_email).get();
		}

		Calendar cal = Calendar.getInstance();

		Collection<Entrenamiento> entrenamientos = entrenamientoRepository.findByUser(user);

		Collection<Entrenamiento> categoria_cal = entrenamientos.stream().filter((entrenamiento -> {
			cal.setTimeInMillis(entrenamiento.getStartTime().getTime());
			return cal.get(Calendar.YEAR) >= objectiveYearMonth1.getYear()
					&& (cal.get(Calendar.MONTH)+1) >= objectiveYearMonth1.getMonthValue();
		})).collect(Collectors.toList());


		Float resultado = 0f;
		for(Entrenamiento entrenamiento: categoria_cal){
				if(entrenamiento.getCategoria().equals(categoria)){
					resultado += entrenamiento.getCaloriasQuemadas();
				}
		}

		return resultado;

	}
}