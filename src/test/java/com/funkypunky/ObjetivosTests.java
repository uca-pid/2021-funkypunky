package com.funkypunky;


import com.funkypunky.Application;
import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Editable;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.resource.impl.CategoriaResourceImpl;
import com.funkypunky.resource.impl.ObjetivosResourceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes={ Application.class })
public class ObjetivosTests {

	@Autowired
	private ObjetivosResourceImpl objetivosResource;

	@Test
	public void getObjetivoByUserAndPeriod() {
		String period1 = "2021-01";
		String period2 = "2021-12";
		assertThat(objetivosResource.getObjetivoByUserAndPeriod("test@user.com",period1,period2)).isNotEmpty();
	}

	@Test
	public void getObjetivoHistory() {
		assertThat(objetivosResource.getObjetivoHistoryByUser("test@user.com")).isNotEmpty();
	}

	@Test
	public void getObjetivoUserAndYearMonth() {
		assertThat(objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-11")).isNotEmpty();
	}

	@Test
	public void agregarObjetivo() throws Exception {
		Map<String, Object> params = new HashMap<>();

		params.put("id_categoria", 7);
		params.put("objetivo", 1500);
		params.put("usuario", "test@user.com");
		params.put("periodo", "2021-12");

		int baseline = objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-12").size();
		objetivosResource.agregarObjetivo(params);
		assertThat(objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-12").size()).isEqualTo(baseline+1);
	}

	@Test
	public void eliminarObjetivo() throws Exception {

		Integer id = objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-11").stream().findFirst().get().getId().intValue();
		Map<String, Object> params = new HashMap<>();
		params.put("id", id);

		int baseline = objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-11").size();
		objetivosResource.eliminarObjetivo(params);
		assertThat(objetivosResource.getObjetivoByUserAndYearMonth("test@user.com","2021-11").size()).isEqualTo(baseline-1);
	}

}
