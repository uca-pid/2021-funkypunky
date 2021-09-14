package com.funkypunky.repository;

import com.funkypunky.domain.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query("FROM Categoria WHERE nombre=:nombre")
    Categoria findByName(@Param("nombre") String nombre);
    
}
