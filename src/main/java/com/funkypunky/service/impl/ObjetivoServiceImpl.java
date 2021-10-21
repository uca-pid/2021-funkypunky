package com.funkypunky.service.impl;


import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Objetivo;
import com.funkypunky.domain.User;
import com.funkypunky.repository.CategoriaRepository;
import com.funkypunky.repository.ObjetivoRepository;
import com.funkypunky.service.IService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.Collection;
import java.util.Optional;

@Service
public class ObjetivoServiceImpl implements IService<Objetivo> {

	@Autowired
	private ObjetivoRepository objetivoRepository;

	@Override
	public Collection<Objetivo> findAll() {
		return objetivoRepository.findAll();
	}

	@Override
	public Optional<Objetivo> findById(Long id) {
		return objetivoRepository.findById(id);
	}

	@Override
	public Objetivo saveOrUpdate(Objetivo categoria) {
		return objetivoRepository.saveAndFlush(categoria);
	}

	public Optional<Objetivo> findByUserAndPeriod(User user, YearMonth period) {
		return objetivoRepository.findByUserAndPeriod(user,period);
	}

	public String deleteByUserAndPeriod(User user, YearMonth period) {
		JSONObject jsonObject = new JSONObject();
		try {
			objetivoRepository.deleteByUserAndPeriod(user,period);
			jsonObject.put("message", "Objetivo deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

	@Override
	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			objetivoRepository.deleteById(id);
			jsonObject.put("message", "Objetivo deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

}