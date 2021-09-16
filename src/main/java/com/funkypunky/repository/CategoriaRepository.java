package com.funkypunky.repository;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Editable;
import com.funkypunky.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;


@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query("FROM Categoria WHERE nombre=:nombre")
    Categoria findByName(@Param("nombre") String nombre);

    @Query("FROM Categoria WHERE user=:user OR user=null")
    Collection<Categoria> findByUser(@Param("user") User user);
        
}
