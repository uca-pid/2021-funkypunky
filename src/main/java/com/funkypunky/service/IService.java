package com.funkypunky.service;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Optional;

@Component
public interface IService<T> {
	Collection<T> findAll();
	
	Optional<T> findById(Long id);
	
	T saveOrUpdate(T t);
	
	String deleteById(Long id);
}
