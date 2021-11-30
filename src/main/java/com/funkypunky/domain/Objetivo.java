package com.funkypunky.domain;

import lombok.*;

import javax.persistence.*;
import java.time.YearMonth;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "objetivo")
public class Objetivo {
	@Id
	@GeneratedValue
	private Long id;

	@ManyToOne
	@JoinColumn (name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private YearMonth period;

	@ManyToOne
	@JoinColumn (name = "category_id", nullable = false)
	private Categoria categoria;


	@Column(nullable = false)
	private Float targetCaloryCount = 0f;

	@Transient
	@Setter
	@Getter
	private Float progressCalory;
}