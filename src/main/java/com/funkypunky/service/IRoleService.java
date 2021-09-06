package com.funkypunky.service;

public interface IRoleService<T> extends IService<T> {

	T findByName(String name);
}
