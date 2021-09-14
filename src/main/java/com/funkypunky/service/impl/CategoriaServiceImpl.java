package com.funkypunky.service.impl;


import com.funkypunky.domain.Categoria;
import com.funkypunky.repository.CategoriaRepository;
import com.funkypunky.service.IService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements IService<Categoria> {

	@Autowired
	private CategoriaRepository categoriaRepository;

	@Override
	public Collection<Categoria> findAll() {
		return categoriaRepository.findAll();
	}

	@Override
	public Optional<Categoria> findById(Long id) {
		return categoriaRepository.findById(id);
	}

	@Override
	public Categoria saveOrUpdate(Categoria categoria) {
		return categoriaRepository.saveAndFlush(categoria);
	}

	@Override
	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			categoriaRepository.deleteById(id);
			jsonObject.put("message", "Categoria deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

}