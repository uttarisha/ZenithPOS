package com.usshh.service;

import com.usshh.domain.UserRole;
import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;

import java.util.List;

public interface EmployeeService {

    UserDTO createStoreEmployee(UserDTO employee, Long storeId) throws Exception;
    UserDTO createBranchEmployee(UserDTO employee, Long branchId) throws Exception;
    User updateEmployee(Long employeeId, UserDTO employeeDetails) throws Exception;
    void deleteEmployee(Long employeeId) throws Exception;
    List<UserDTO> findStoreEmployees(Long storeId, UserRole role) throws Exception;
    List<UserDTO> findBranchEmployees(Long branchId, UserRole role) throws Exception;
    UserDTO assignExistingEmployee(Long branchId, String email, UserRole role) throws Exception;
}
