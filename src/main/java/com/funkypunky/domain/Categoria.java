package com.funkypunky.domain;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
@Table(name = "categoria")
public class Categoria {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private float calPerMin;

	@Enumerated
	private Editable is_editable;

	public Categoria() {
	}

}

