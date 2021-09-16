package com.funkypunky.service.impl;


import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.service.IService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class EntrenamientoServiceImpl implements IService<Entrenamiento> {

	@Autowired
	private EntrenamientoRepository entrenamientoRepository;

	@Override
	public Collection<Entrenamiento> findAll() {
		return entrenamientoRepository.findAll();
	}

	@Override
	public Optional<Entrenamiento> findById(Long id) {
		return entrenamientoRepository.findById(id);
	}

	@Override
	public Entrenamiento saveOrUpdate(Entrenamiento entrenamiento) {
		return entrenamientoRepository.saveAndFlush(entrenamiento);
	}

	@Override
	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			entrenamientoRepository.deleteById(id);
			jsonObject.put("message", "Entrenamiento deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

}