package com.funkypunky.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.joda.time.Interval;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@AllArgsConstructor
@Table(name = "entrenamiento")
public class Entrenamiento {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String description;

	@ManyToOne
	@JoinColumn (name = "user_id", nullable = false)
	private User assignedUser;

	@ManyToOne
	@JoinColumn (name = "category_id", nullable = false)
	private Categoria categoria;

	@Column(nullable = false)
	private Timestamp startTime;

	@Column
	private Integer duracion;

	public Float getCaloriasQuemadas(){
		return duracion * categoria.getCalPerMin();
	}

	public Entrenamiento() {
	}

}