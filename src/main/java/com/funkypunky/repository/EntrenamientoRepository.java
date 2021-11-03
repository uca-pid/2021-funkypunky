package com.funkypunky.repository;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Collection;

@Repository
public interface EntrenamientoRepository extends JpaRepository<Entrenamiento, Long> {

    @Query("FROM Entrenamiento WHERE assignedUser=:user_id")
    Collection<Entrenamiento> findByUser(@Param("user_id") User user_id);

    @Transactional
    @Modifying
    @Query("delete from Entrenamiento e where e.categoria=:categoria")
    void deleteByCategoria(@Param("categoria") Categoria categoria);
}
