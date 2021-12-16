package com.funkypunky;

import com.funkypunky.domain.*;
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
public class EntrenamientoTest {

    @Autowired
    private EntrenamientoResourceImpl entrenamientoResource;

    @Test
    public void getEntrenamientosTest() throws Exception {
        assertThat(entrenamientoResource.getEntrenamientoByuser("test@user.com")).isNotEmpty();
    }

    @Test
    public void agregarEntrenamiento() throws Exception {
        Map<String, Object> params = new HashMap<>();

        params.put("id_categoria", 7);
        params.put("descripcion", "prueba");
        params.put("duracion", 123);
        params.put("usuario", "test@user.com");
        params.put("fecha", "2016-05-02T00:00");

        assertThat(entrenamientoResource.getEntrenamientoByuser("test@user.com").size()).isEqualTo(4);
        entrenamientoResource.agregarEntrenamiento(params);
        assertThat(entrenamientoResource.getEntrenamientoByuser("test@user.com").size()).isEqualTo(5);
    }

    @Test
    public void eliminarEntrenamiento() throws Exception {

        Integer id = entrenamientoResource.getEntrenamientoByuser("test@user.com").stream().findFirst().get().getId().intValue();
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);

        int baseline = entrenamientoResource.getEntrenamientoByuser("test@user.com").size();
        entrenamientoResource.eliminarEntrenamiento(params);
        assertThat(entrenamientoResource.getEntrenamientoByuser("test@user.com").size()).isEqualTo(baseline-1);
    }
}