package com.funkypunky;

import com.funkypunky.domain.*;
import com.funkypunky.repository.EntrenamientoRepository;
import com.funkypunky.resource.impl.EntrenamientoResourceImpl;
import com.funkypunky.service.impl.EntrenamientoServiceImpl;
import com.funkypunky.service.impl.UserServiceImpl;
import org.joda.time.Interval;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.MOCK, classes={ Application.class })
public class EntrenamientoServiceTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private EntrenamientoRepository entrenamientoRepository;

    @InjectMocks
    private EntrenamientoResourceImpl entrenamientoResource;

    private User user;
    private Categoria categoria;
    private Entrenamiento entrenamiento;

    @Before
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        this.mockMvc = webAppContextSetup(webApplicationContext).build();

        user = new User();
        user.setId(123L);
        user.setEmail("test@user.com");
        user.setName("Test User");
        user.setMobile("9787456545");
        user.setRole(new Role());
        user.setPassword("test1234");

        categoria = new Categoria(10L, "Correr", 14.5F, Editable.EDITABLE);

        entrenamiento = new Entrenamiento(1L,"Prueba correr", user,categoria,new Timestamp(1234), new Timestamp(5678),new Interval(new Timestamp(1234).getNanos(),new Timestamp(5678).getNanos()));
    }

    @Test
    @WithMockUser(username="test@user.com")
    public void should_CreateAccount_When_ValidRequest() throws Exception {

        /* setup mock */

        Collection<Entrenamiento> entrenamientos = new ArrayList<Entrenamiento>();

        entrenamientos.add(entrenamiento);

        MockHttpServletResponse resultado = mockMvc.perform(get("/entrenamiento/getEntrenamientos")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse();

        assertThat(resultado.getStatus()).isEqualTo(HttpStatus.OK.value());
        System.out.println(resultado.getContentAsString());
//        assertThat(resultado.getContentAsString()).isEqualTo("[{\"id\":6,\"name\":\"Lagos con agus el martes\",\"assignedUser\":{\"id\":3,\"name\":\"Test User\",\"email\":\"test@user.com\",\"mobile\":\"9787456545\",\"password\":\"$2a$10$9ZQGQaSG7Ct4yj6GgtPYSupI82R9b3qOZlQXXYhWMHNvPf51L35wq\",\"role\":{\"name\":\"USER\"}},\"categoria\":{\"id\":5,\"nombre\":\"Correr\",\"calPerMin\":10.0,\"is_editable\":\"EDITABLE\"},\"startTime\":\"1970-01-01T00:00:12.344+00:00\",\"endTime\":\"1970-01-01T00:00:16.666+00:00\",\"interval\":null}]");
    }
}