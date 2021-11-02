package com.funkypunky;

import com.funkypunky.domain.*;
import com.funkypunky.service.IRoleService;
import com.funkypunky.service.IService;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.EntrenamientoServiceImpl;
import com.funkypunky.service.impl.ObjetivoServiceImpl;
import com.funkypunky.utils.ConstantUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.YearMonth;
import java.util.Date;


@SpringBootApplication
public class Application implements CommandLineRunner {
	@Autowired
	private IService<User> userService;

	@Autowired
	private EntrenamientoServiceImpl entrenamientoService;

	@Autowired
	private ObjetivoServiceImpl objetivoService;

	@Autowired
	private CategoriaServiceImpl categoriaService;

	@Autowired
	private IRoleService<Role> roleService;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (roleService.findAll().isEmpty()) {
			roleService.saveOrUpdate(new Role(ConstantUtils.ADMIN.toString()));
			roleService.saveOrUpdate(new Role(ConstantUtils.USER.toString()));
		}

		if (userService.findAll().isEmpty()) {
			User user1 = new User();
			user1.setEmail("test@user.com");
			user1.setName("Test User");
			user1.setMobile("9787456545");
			user1.setRole(roleService.findByName(ConstantUtils.USER.toString()));
			user1.setPassword(new BCryptPasswordEncoder().encode("testuser"));
			userService.saveOrUpdate(user1);


			User user2 = new User();
			user2.setEmail("test@admin.com");
			user2.setName("Test Admin");
			user2.setMobile("9787456545");
			user2.setRole(roleService.findByName(ConstantUtils.ADMIN.toString()));
			user2.setPassword(new BCryptPasswordEncoder().encode("testadmin"));
			userService.saveOrUpdate(user2);

			Categoria categoria3 = new Categoria();
			categoria3.setCalPerMin(80F);
			categoria3.setIs_editable(Editable.EDITABLE);
			categoria3.setNombre("Remar");
			categoria3.setUser(user2);
			categoriaService.saveOrUpdate(categoria3);

		}

		if (entrenamientoService.findAll().isEmpty()) {
			Entrenamiento entrenamiento1 = new Entrenamiento();
			User user = userService.findAll().stream().findFirst().get();
			Entrenamiento entrenamiento2 = new Entrenamiento();
			Entrenamiento entrenamiento3 = new Entrenamiento();
			Entrenamiento entrenamiento4 = new Entrenamiento();
			Objetivo objetivo = new Objetivo();


			//Agregar Categorias Fijas
			Categoria categoria = new Categoria();
			categoria.setCalPerMin(13F);
			categoria.setIs_editable(Editable.NOT_EDITABLE);
			categoria.setNombre("Correr");
			categoria.setUser(null);
			categoriaService.saveOrUpdate(categoria);


			Categoria categoria2 = new Categoria();
			categoria2.setCalPerMin(5F);
			categoria2.setIs_editable(Editable.NOT_EDITABLE);
			categoria2.setNombre("Caminar");
			categoria2.setUser(null);
			categoriaService.saveOrUpdate(categoria2);

			Categoria categoria3 = new Categoria();
			categoria3.setCalPerMin(6F);
			categoria3.setIs_editable(Editable.NOT_EDITABLE);
			categoria3.setNombre("Ciclismo");
			categoria3.setUser(null);
			categoriaService.saveOrUpdate(categoria3);

			Categoria categoria4 = new Categoria();
			categoria4.setCalPerMin(8F);
			categoria4.setIs_editable(Editable.NOT_EDITABLE);
			categoria4.setNombre("Natacion");
			categoria4.setUser(null);
			categoriaService.saveOrUpdate(categoria4);

			Categoria categoria5 = new Categoria();
			categoria5.setCalPerMin(6F);
			categoria5.setIs_editable(Editable.NOT_EDITABLE);
			categoria5.setNombre("Gimnasio");
			categoria5.setUser(null);
			categoriaService.saveOrUpdate(categoria5);

			Categoria categoria6 = new Categoria();
			categoria6.setCalPerMin(13F);
			categoria6.setIs_editable(Editable.EDITABLE);
			categoria6.setNombre("Saltar la soga");
			categoria6.setUser(user);
			categoriaService.saveOrUpdate(categoria6);

			DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
			Date date = dateFormat.parse("03/11/2021");
			long time = date.getTime();

			entrenamiento1.setCategoria(categoria2);
			entrenamiento1.setAssignedUser(user);
			entrenamiento1.setStartTime(new Timestamp(time));
			entrenamiento1.setDuracion(120);
			entrenamiento1.setDescription("Lagos con agus el martes");

			entrenamiento2.setCategoria(categoria);
			entrenamiento2.setAssignedUser(user);
			entrenamiento2.setStartTime(new Timestamp(time));
			entrenamiento2.setDuracion(10);
			entrenamiento2.setDescription("Correr por la city");


			date = dateFormat.parse("23/04/2021");
			time = date.getTime();

			entrenamiento3.setCategoria(categoria2);
			entrenamiento3.setAssignedUser(user);
			entrenamiento3.setStartTime(new Timestamp(time));
			entrenamiento3.setDuracion(15);
			entrenamiento3.setDescription("Saltando la soga");

			date = dateFormat.parse("23/11/2021");
			time = date.getTime();

			entrenamiento4.setCategoria(categoria2);
			entrenamiento4.setAssignedUser(user);
			entrenamiento4.setStartTime(new Timestamp(time));
			entrenamiento4.setDuracion(25);
			entrenamiento4.setDescription("nicky jugando");


			objetivo.setPeriod(YearMonth.parse("2021-11"));
			objetivo.setUser(user);
			objetivo.setTargetCaloryCount(1200f);


			objetivoService.saveOrUpdate(objetivo);
			entrenamientoService.saveOrUpdate(entrenamiento1);
			entrenamientoService.saveOrUpdate(entrenamiento2);
			entrenamientoService.saveOrUpdate(entrenamiento3);
			entrenamientoService.saveOrUpdate(entrenamiento4);


		}
	}

}
