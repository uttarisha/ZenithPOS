package com.usshh.controller;

import com.usshh.domain.UserRole;
import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;
import com.usshh.payload.response.ApiResponse;
import com.usshh.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/store/{storeId}")
    public ResponseEntity<UserDTO> createStoreEmployee(
            @PathVariable Long storeId,
            @RequestBody UserDTO userDto) throws Exception {
        UserDTO employee = employeeService.createStoreEmployee(userDto, storeId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping("/branch/{branchId}")
    public ResponseEntity<UserDTO> createBranchEmployee(
            @PathVariable Long branchId,
            @RequestBody UserDTO userDto) throws Exception {
        UserDTO employee = employeeService.createBranchEmployee(userDto, branchId);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateEmployee(
            @PathVariable Long id,
            @RequestBody UserDTO userDto) throws Exception {
        User employee = employeeService.updateEmployee(id, userDto);
        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(
            @PathVariable Long id
    ) throws Exception {
        employeeService.deleteEmployee(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Employee deleted");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/store/{id}")
    public ResponseEntity<List<UserDTO>> storeEmployee(
            @PathVariable Long id,
            @RequestParam(required = false) UserRole userRole) throws Exception {
        List<UserDTO> employee = employeeService.findStoreEmployees(id, userRole);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<List<UserDTO>> branchEmployee(
            @PathVariable Long id,
            @RequestParam(required = false) UserRole userRole) throws Exception {
        List<UserDTO> employee = employeeService.findBranchEmployees(id, userRole);
        return ResponseEntity.ok(employee);
    }
    @PostMapping("/branch/{branchId}/assign")
    public ResponseEntity<UserDTO> assignExistingEmployee(
            @PathVariable Long branchId,
            @RequestBody UserDTO userDto) throws Exception {
        UserDTO employee = employeeService.assignExistingEmployee(
                branchId, userDto.getEmail(), userDto.getRole());
        return ResponseEntity.ok(employee);
    }
}