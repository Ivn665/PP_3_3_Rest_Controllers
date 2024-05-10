package ru.kata.spring.boot_security.demo.dto;

import lombok.Getter;
import lombok.Setter;
import ru.kata.spring.boot_security.demo.model.Role;

import java.util.Set;

@Getter
@Setter
public class UserDto {

    private long id;

    private String firstName;

    private String lastName;

    private byte age;

    private String email;

    private String password;

    private Set<Role> roles;

}
