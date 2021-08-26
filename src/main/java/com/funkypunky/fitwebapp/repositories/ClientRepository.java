package com.funkypunky.fitwebapp.repositories;

import com.funkypunky.fitwebapp.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {

}