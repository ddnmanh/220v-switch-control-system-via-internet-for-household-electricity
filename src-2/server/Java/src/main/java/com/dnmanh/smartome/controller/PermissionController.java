package com.dnmanh.smartome.controller;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.service.GeneralService;
import com.dnmanh.smartome.util.error.FieldsException;
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
import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.service.PermissionService;
import com.dnmanh.smartome.util.annotation.ApiMessage;
import com.dnmanh.smartome.util.error.IdInvalidException;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1")
public class PermissionController {

    private final GeneralService generalService;
    private final PermissionService permissionService;

    public PermissionController(GeneralService generalService, PermissionService permissionService) {
        this.generalService = generalService;
        this.permissionService = permissionService;
    }

    @PostMapping("/permissions")
    @ApiMessage("Create a permission")
    public ResponseEntity<Permission> create(@RequestBody Permission permissionReqBody) throws Exception, RuntimeException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.permissionService.create(permissionReqBody));
    }

    @PutMapping("/permissions")
    @ApiMessage("Update a permission")
    public ResponseEntity<Permission> update(@RequestBody Permission permissionReqBody) throws Exception, RuntimeException {
        return ResponseEntity.ok().body(this.permissionService.update(permissionReqBody));
    }

    @DeleteMapping("/permissions/{id}")
    @ApiMessage("delete a permission")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) throws IdInvalidException {

        int intID = this.generalService.convertIdStringToInt(id);

        if (intID == -1) throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("id", "Id is invalid")));

        this.permissionService.delete(intID);

        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/permissions")
    @ApiMessage("Fetch permissions")
    public ResponseEntity<ResPaginationDTO<Permission>> getPermissions(
            @Filter Specification<Permission> spec, // Parameter for filter "sort"
            Pageable pageable // Parameter for pagination "page", "size", config on application.properties
    ) {

        return ResponseEntity.ok(this.permissionService.getPermissions(spec, pageable));
    }
}
