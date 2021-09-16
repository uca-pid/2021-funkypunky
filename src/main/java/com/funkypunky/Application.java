package com.funkypunky;

import com.funkypunky.domain.*;
import com.funkypunky.service.IRoleService;
import com.funkypunky.service.IService;
import com.funkypunky.service.impl.CategoriaServiceImpl;
import com.funkypunky.service.impl.EntrenamientoServiceImpl;
import com.funkypunky.utils.ConstantUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Timestamp;


@SpringBootApplication
public class Application implements CommandLineRunner {
	@Autowired
	private IService<User> userService;

	@Autowired
	private EntrenamientoServiceImpl entrenamientoService;

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

			Categoria categoria = new Categoria();
			categoria.setCalPerMin(10F);
			categoria.setIs_editable(Editable.EDITABLE);
			categoria.setNombre("Correr");
			categoria.setUser(user);
			categoriaService.saveOrUpdate(categoria);


			Categoria categoria2 = new Categoria();
			categoria2.setCalPerMin(5F);
			categoria2.setIs_editable(Editable.NOT_EDITABLE);
			categoria2.setNombre("Caminar");
			categoria2.setUser(null);
			categoriaService.saveOrUpdate(categoria2);



			entrenamiento1.setCategoria(categoria);
			entrenamiento1.setAssignedUser(user);
			entrenamiento1.setStartTime(new Timestamp(12344));
			entrenamiento1.setEndTime(new Timestamp(16666));
			entrenamiento1.setName("Lagos con agus el martes");

			entrenamientoService.saveOrUpdate(entrenamiento1);
		}
	}

}
