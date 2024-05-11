package ru.kata.spring.boot_security.demo.controler;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.util.UserErrorResponse;
import ru.kata.spring.boot_security.demo.util.UserNotSavedException;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import javax.servlet.http.HttpSession;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/")
public class MainPageRestController {

    private final UserService userService;
    private final RoleService roleService;
    private final ModelMapper modelMapper;
    private final UserValidator userValidator;

    @Autowired
    public MainPageRestController(UserService userService, RoleService roleService,
                                  ModelMapper modelMapper, UserValidator userValidator) {
        this.userService = userService;
        this.roleService = roleService;
        this.modelMapper = modelMapper;
        this.userValidator = userValidator;
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream().map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("user/{id}")
    public UserDto getUserById(@PathVariable("id") long id) {
        return convertToDto(userService.getById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<HttpStatus> saveUser(@RequestBody UserDto userDto, BindingResult bindingResult) {
        User user = convertToUser(userDto);
        userValidator.validate(user, bindingResult);
        if (bindingResult.hasErrors()) {
            throw new UserNotSavedException(createExceptionMsg(bindingResult));
        }
        userService.saveUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody UserDto userDto, BindingResult bindingResult) {
        User user = convertToUser(userDto);
        userValidator.validate(user, bindingResult);
        if (bindingResult.hasErrors()) {
            throw new UserNotSavedException(createExceptionMsg(bindingResult));
        }
        userService.editUser(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<HttpStatus> deleteUser(@RequestBody long id, Authentication authentication, HttpSession session) {
        if (authentication.getName().equals(userService.getById(id).getUsername())) {
            session.invalidate();
        }
        userService.deleteById(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    public User convertToUser(UserDto userDto) {
        User user = modelMapper.map(userDto, User.class);
        Set<Role> roles = new HashSet<>();
        for (String role : userDto.getRoles()) {
            roles.add(roleService.getRoleByName(Role.RoleType.valueOf(role)));
        }
        user.setRoles(roles);
        return user;
    }

    public UserDto convertToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        userDto.setPassword("");
        return  userDto;
    }

    private String createExceptionMsg(BindingResult bindingResult) {
        List<FieldError> errors = bindingResult.getFieldErrors();
        StringBuilder errorMsg = new StringBuilder();
        for (FieldError error : errors) {
            errorMsg.append(error.getField()).append(" - ")
                    .append(error.getDefaultMessage()).append("; ");
        }
        return errorMsg.toString();
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> UserNotSavedExceptionHandler(UserNotSavedException e) {
        UserErrorResponse response = new UserErrorResponse(e.getMessage(), System.currentTimeMillis());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
