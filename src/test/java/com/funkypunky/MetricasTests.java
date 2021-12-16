package com.funkypunky;


import com.funkypunky.domain.Categoria;
import com.funkypunky.domain.Entrenamiento;
import com.funkypunky.domain.User;
import com.funkypunky.resource.impl.CategoriaResourceImpl;
import com.funkypunky.resource.impl.MetricasResourceImpl;
import com.funkypunky.resource.impl.ObjetivosResourceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes={ Application.class })
public class MetricasTests {

	@Autowired
	private MetricasResourceImpl metricasResource;

	@Autowired
	private CategoriaResourceImpl categoriaResource;

	@Test
	public void getMetricasByUserAndMonth() {
		String period1 = "2021-11";
		assertThat(metricasResource.getMetricByUserMonth("test@user.com",period1)).isNotEmpty();
	}

	@Test
	public void getCaloriesInRange() {
		String period1 = "2021-11";
		String period2 = "2021-12";
		assertThat(metricasResource.getCaloriesInRange("test@user.com",period1,period2)).isNotEmpty();
	}

	@Test
	public void getCaloriesInMonthAndCategory() {
		YearMonth yearMonthStart = YearMonth.parse("2021-11");

		Categoria category = categoriaResource.getCategoriaByuser("test@user.com").stream().findFirst().get();
		assertThat(metricasResource.getCaloriesInMonthAndCategory("test@user.com",yearMonthStart,category)).isNotNaN();
	}

}
