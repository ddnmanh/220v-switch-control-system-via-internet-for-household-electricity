package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.service.GeneralService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import com.dnmanh.smartome.entity.Role;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.service.RoleService;
import com.dnmanh.smartome.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class RoleController {

    private final GeneralService generalService;
    private final RoleService roleService;

    public RoleController(GeneralService generalService, RoleService roleService) {
        this.generalService = generalService;
        this.roleService = roleService;
    }

    @PostMapping("/roles")
    @ApiMessage("Create a role")
    public ResponseEntity<Role> create(@RequestBody Role roleReqBody) throws Exception, RuntimeException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.create(roleReqBody));
    }

    @PutMapping("/roles")
    @ApiMessage("Update a role")
    public ResponseEntity<Role> update(@Valid @RequestBody Role roleReqBody) throws Exception, RuntimeException {
        return ResponseEntity.ok().body(this.roleService.update(roleReqBody));
    }

    @DeleteMapping("/roles/{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) throws Exception, RuntimeException {

        int intID = this.generalService.convertIdStringToInt(id);

        this.roleService.delete(intID);

        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/roles")
    @ApiMessage("Fetch roles")
    public ResponseEntity<ResPaginationDTO<Role>> getPermissions(
            @Filter Specification<Role> spec, // Parameter for filter "sort"
            Pageable pageable // Parameter for pagination "page", "size", config on application.properties
    ) {
        return ResponseEntity.ok(this.roleService.getAllRoles(spec, pageable));
    }

    @GetMapping("/roles/{id}")
    @ApiMessage("Fetch role by id")
    public ResponseEntity<Role> getById(@PathVariable("id") long id) throws Exception, RuntimeException {

        Role role = this.roleService.fetchById(id);

        return ResponseEntity.ok().body(role);
    }

}
