package com.funkypunky.repository;

import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Objetivo;
import com.funkypunky.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.time.YearMonth;
import java.util.Collection;
import java.util.Optional;


@Repository
public interface ObjetivoRepository extends JpaRepository<Objetivo, Long> {

    @Query("FROM Objetivo WHERE user=:user AND period=:period")
    Optional<Objetivo> findByUserAndPeriod(@Param("user") User user, @Param("period") YearMonth period );

    @Transactional
    @Modifying
    @Query("delete FROM Objetivo WHERE user=:user AND categoria=:categoria AND period=:period")
    void deleteByUserAndPeriod(@Param("user") User user, @Param("period") YearMonth period,@Param("categoria") Categoria categoria );

    @Transactional
    @Modifying
    @Query("delete FROM Objetivo WHERE user=:user AND categoria=:categoria")
    void deleteByUserAndCategory(@Param("user") User user, @Param("categoria") Categoria categoria );

    @Query("FROM Objetivo WHERE user=:user")
    Collection<Objetivo> findHistoryByUser(@Param("user") User user);

    @Query("FROM Objetivo o WHERE o.user=:user AND period BETWEEN :yearMonthStart AND :yearMonthEnd")
    Collection<Objetivo> findByUserAndPeriodRange(@Param("user") User user,@Param("yearMonthStart") YearMonth yearMonthStart,@Param("yearMonthEnd") YearMonth yearMonthEnd);

    @Query("FROM Objetivo o WHERE o.user=:user AND period=:yearMonth")
    Collection<Objetivo> findByUserAndMonth(@Param("user") User user,@Param("yearMonth") YearMonth yearMonth);

    @Query("FROM Objetivo o WHERE o.user=:user AND o.categoria=:categoria AND o.period=:period")
    Optional<Objetivo> findByUserAndPeriodAndCategory(@Param("user") User user,@Param("period") YearMonth period,@Param("categoria") Categoria categoria);
}
