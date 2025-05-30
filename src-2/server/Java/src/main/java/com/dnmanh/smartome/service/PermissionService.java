package com.dnmanh.smartome.service;

import java.util.Collections;
import java.util.Optional;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.repository.PermissionRepository;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public boolean isPermissionExist(Permission p) {
        return permissionRepository.existsByModuleAndApiPathAndMethod(
                p.getModule(),
                p.getApiPath(),
                p.getMethod());
    }

    public Permission fetchById(long id) {
        Optional<Permission> permissionOptional = this.permissionRepository.findById(id);
        if (permissionOptional.isPresent())
            return permissionOptional.get();
        return null;
    }

    public Permission create(Permission permission) {

        // check exist
        if (this.isPermissionExist(permission)) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("name", "Permission is already exist")));
        }

        return this.permissionRepository.save(permission);
    }

    public Permission update(Permission permission) {

        Permission permissionDB = this.fetchById(permission.getId());
        // check exist by id
        if (permissionDB == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("name", "Permission with id = " + permission.getId() + " does not exists.")));
        }

        if (permission.getName() != null && permission.getName().equals(permissionDB.getName())) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("name", "Permission is already exists.")));
        }

        permissionDB.setName(permission.getName());
        permissionDB.setApiPath(permission.getApiPath());
        permissionDB.setMethod(permission.getMethod());
        permissionDB.setModule(permission.getModule());

        // update
        return this.permissionRepository.save(permissionDB);
    }

    public void delete(long id) {

        // check exist by id
        if (this.fetchById(id) == null) {
            throw new FieldsException(Collections.singletonList(new InvalidFieldDTO("name", "Permission does not exists.")));
        }

        // delete permission_role
        Optional<Permission> permissionOptional = this.permissionRepository.findById(id);
        Permission currentPermission = permissionOptional.get();
        currentPermission.getRoles().forEach(role -> role.getPermissions().remove(currentPermission));

        // delete permission
        this.permissionRepository.delete(currentPermission);
    }

    public ResPaginationDTO<Permission> getPermissions(Specification<Permission> spec, Pageable pageable) {
        Page<Permission> pPermissions = this.permissionRepository.findAll(spec, pageable);
        ResPaginationDTO<Permission> rs = new ResPaginationDTO<Permission>();
        ResPaginationDTO.Meta mt = new ResPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pPermissions.getTotalPages());
        mt.setTotal(pPermissions.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pPermissions.getContent());
        return rs;
    }
}
