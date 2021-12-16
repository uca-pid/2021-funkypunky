package com.funkypunky;


import com.funkypunky.domain.*;
import com.funkypunky.resource.impl.CategoriaResourceImpl;
import com.funkypunky.resource.impl.EntrenamientoResourceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes={ Application.class })
public class CategoriaTests {

	@Autowired
	private CategoriaResourceImpl categoriaResource;

	@Test
	public void getCategorias() {
		assertThat(categoriaResource.getCategoriaByuser("test@user.com")).isNotEmpty();
	}

	@Test
	public void agregarCategoria() throws Exception {
		Map<String, Object> params = new HashMap<>();

		params.put("user_mail", "test@user.com");
		params.put("calPerMin", 123);
		params.put("nombre", "Arrastrarse");

		int baseline = categoriaResource.getCategoriaByuser("test@user.com").size();
		categoriaResource.agregarCategoria(params);
		assertThat(categoriaResource.getCategoriaByuser("test@user.com").size()).isEqualTo(baseline+1);
	}

	@Test
	public void eliminarCategoria() throws Exception {

		Integer id = categoriaResource.getCategoriaByuser("test@user.com").stream().filter(a -> a.getIs_editable() == Editable.EDITABLE).findFirst().get().getId().intValue();
		Map<String, Object> params = new HashMap<>();
		params.put("id", id);
		params.put("user_mail", "test@user.com");


		int baseline = categoriaResource.getCategoriaByuser("test@user.com").size();
		categoriaResource.eliminarCategoria(params);
		assertThat(categoriaResource.getCategoriaByuser("test@user.com").size()).isEqualTo(baseline-1);
	}

}
