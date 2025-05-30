package com.dnmanh.smartome.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.dnmanh.smartome.dto.exception.InvalidFieldDTO;
import com.dnmanh.smartome.util.error.FieldsException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.dnmanh.smartome.entity.Permission;
import com.dnmanh.smartome.entity.Role;
import com.dnmanh.smartome.dto.response.ResPaginationDTO;
import com.dnmanh.smartome.repository.PermissionRepository;
import com.dnmanh.smartome.repository.RoleRepository;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(
            RoleRepository roleRepository,
            PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public boolean existByName(String name) {
        return this.roleRepository.existsByName(name);
    }

    public Role create(Role role) throws FieldsException {

        if (this.existByName(role.getName())) {
            throw new FieldsException(List.of(new InvalidFieldDTO("name", "Role with name = " + role.getName() + " is already exist")));
        }

        // check permissions
        if (role.getPermissions() != null) {
            List<Long> reqPermissions = role.getPermissions()
                    .stream().map(x -> x.getId())
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
            role.setPermissions(dbPermissions);
        }

        return this.roleRepository.save(role);
    }

    public Role fetchById(long id) {
        Optional<Role> roleOptional = this.roleRepository.findById(id);
        if (roleOptional.isPresent())
            return roleOptional.get();

        return null;
    }

    public Role update(Role role) throws FieldsException {

        // check id
        if (this.fetchById(role.getId()) == null) {
            throw new FieldsException(List.of(new InvalidFieldDTO("id", "Role with id = " + role.getId() + " does not exist")));
        }

        // check name
        if (this.existByName(role.getName())) {
            throw new FieldsException(List.of(new InvalidFieldDTO("name", "Role with name = " + role.getName() + " does not exist")));
        }

        Role roleDB = this.fetchById(role.getId());

        // check permissions
        if (role.getPermissions() != null) {
            List<Long> reqPermissions = role.getPermissions()
                    .stream().map(x -> x.getId())
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
            role.setPermissions(dbPermissions);
        }

        roleDB.setName(role.getName());
        roleDB.setDescription(role.getDescription());
        roleDB.setActive(role.isActive());
        roleDB.setPermissions(role.getPermissions());

        return this.roleRepository.save(roleDB);
    }

    public void delete(long id) {
        this.roleRepository.deleteById(id);
    }

    public ResPaginationDTO<Role> getAllRoles(Specification<Role> spec, Pageable pageable) {

        Page<Role> pageRole = this.roleRepository.findAll(spec, pageable);

        ResPaginationDTO<Role> res = new ResPaginationDTO<>();
        ResPaginationDTO.Meta mt = new ResPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());

        mt.setPages(pageRole.getTotalPages());
        mt.setTotal(pageRole.getTotalElements());

        res.setMeta(mt);
        res.setResult(pageRole.getContent());

        return res;
    }

}
