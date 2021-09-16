package com.funkypunky.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "categoria")
public class Categoria {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String nombre;

	@Column(nullable = false)
	private Float calPerMin;

	@ManyToOne
	@JoinColumn
	private User user;

	@Enumerated
	private Editable is_editable;

}

