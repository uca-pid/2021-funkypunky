package com.funkypunky.repository;

import com.funkypunky.domain.Entrenamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface EntrenamientoRepository extends JpaRepository<Entrenamiento, Long> {

    @Query("FROM Entrenamiento WHERE assignedUser=:user_id")
    Collection<Entrenamiento> findByUser(@Param("user_id") Long user_id);

}
