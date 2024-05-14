package ru.kata.spring.boot_security.demo.controler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
public class ViewController {

    private final RoleService roleService;
    private final UserService userService;

    @Autowired
    public ViewController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginPage() {
        return "/WEB-INF/login.html";
    }

    @GetMapping("/")
    public String showMainPage(Model model, Authentication authentication) {
        fillCommonsAttributes(model, authentication);
        return "/WEB-INF/mainPage.html";
    }

    private void fillCommonsAttributes(Model model, Authentication authentication) {
        model.addAttribute("authenticatedUser", userService.getByEmail(authentication.getName()).get());
        if (AuthorityUtils.authorityListToSet(authentication.getAuthorities()).contains("ROLE_ADMIN")) {
            model.addAttribute("usersList", userService.getAllUsers());
            model.addAttribute("roles", roleService.getAllRoles());
        }
    }
}
