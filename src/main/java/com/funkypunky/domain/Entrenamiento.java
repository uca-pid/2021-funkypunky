package com.funkypunky.domain;

import lombok.Data;
import org.h2.api.Interval;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Data
@Table(name = "entrenamiento")
public class Entrenamiento {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String name;

	@ManyToOne
	@JoinColumn (name = "user_id", nullable = false)
	private User assignedUser;

	@ManyToOne
	@JoinColumn (name = "category_id", nullable = false)
	private Categoria categoria;

	@Column(nullable = false)
	private Timestamp startTime;

	@Column(nullable = false)
	private Timestamp endTime;

	@Transient
	private Interval interval;

	public Entrenamiento() {
	}

}