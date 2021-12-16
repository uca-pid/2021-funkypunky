package com.funkypunky;


import com.funkypunky.domain.User;
import com.funkypunky.resource.impl.UserResourceImpl;
import com.funkypunky.service.impl.RoleServiceImpl;
import com.funkypunky.utils.ConstantUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(classes={ Application.class })
public class UsuarioTests {

    @Autowired
    private UserResourceImpl userResource;
    @Autowired
    private RoleServiceImpl roleService;

    @Test
    public void registerUser() {

        User user = new User();
        user.setEmail("pepe@gmail.com");
        user.setName("Test User");
        user.setMobile("1555505050");
        user.setRole(roleService.findByName(ConstantUtils.USER.toString()));
        user.setPassword(new BCryptPasswordEncoder().encode("holaMundo123"));

        assertThat(userResource.register(user).getStatusCodeValue()).isEqualTo(200);
    }

    @Test
    public void changeUserPw() {

        Map<String, Object> params = new HashMap<>();
        params.put("username", "test@user.com");
        params.put("password", "argentina10");

        assertThat(userResource.changeUserPw(params).getStatusCodeValue()).isEqualTo(200);
    }


}