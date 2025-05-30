package com.dnmanh.smartome.util;

import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.entity.Role;
import com.dnmanh.smartome.entity.User;
import com.dnmanh.smartome.repository.PermissionRepository;
import com.dnmanh.smartome.repository.RoleRepository;
import com.dnmanh.smartome.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseInitializerUtil {

    @Autowired
    private Environment env;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public DatabaseInitializerUtil() { }

    public void run(ArrayList<Permission> arrPermis) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        long countPermissions = this.permissionRepository.count();
        long countRoles = this.roleRepository.count();
        long countUsers = this.userRepository.count();

        if (countPermissions == 0) {
//            ArrayList<Permission> arr = new ArrayList<>();
//            arr.add(new Permission("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));

            this.permissionRepository.saveAll(arrPermis);
        }

        if (countRoles == 0) {
            List<Permission> allPermissions = this.permissionRepository.findAll();

            List<Role> listRole = new ArrayList<>();

            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Admin is full permissions");
            adminRole.setActive(true);
            adminRole.setPermissions(allPermissions);
            listRole.add(adminRole);

            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("User is limited permissions");
            userRole.setActive(true);
            userRole.setPermissions(null);
            listRole.add(userRole);

            this.roleRepository.saveAll(listRole);
        }

        if (countUsers == 0) {

            List<User> listUser = new ArrayList<>();

            // Tạo người dùng super admin để test
            User adminUser = new User();
            adminUser.setEmail("superadmin@email.com");
            adminUser.setUsername("superadmin");
            adminUser.setPassword(this.passwordEncoder.encode(this.env.getProperty("env.user-init.password")));
            adminUser.setName("Super Admin");

            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }

            listUser.add(adminUser);

            // Tạo người dùng bình thường để test
//            User testUser = new User();
//            testUser.setEmail(this.env.getProperty("env.user-init.email"));
//            testUser.setUsername(this.env.getProperty("env.user-init.username"));
//            testUser.setPassword(this.passwordEncoder.encode(this.env.getProperty("env.user-init.password")));
//            testUser.setName("Duc Manh");
//
//            Role userRole = this.roleRepository.findByName("USER");
//            if (userRole != null) {
//                testUser.setRole(userRole);
//            }
//
//            listUser.add(testUser);

            this.userRepository.saveAll(listUser);
        }

        if (countPermissions > 0 && countRoles > 0 && countUsers > 0) {
            System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
        } else
            System.out.println(">>> END INIT DATABASE");
    }

}
