package com.usshh.controller;

import com.usshh.domain.UserRole;
import com.usshh.model.User;
import com.usshh.payload.dto.BranchDTO;
import com.usshh.payload.response.ApiResponse;
import com.usshh.service.BranchService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;
    private final UserService userService; // NEW

    @PostMapping
    public ResponseEntity<BranchDTO> createBranch(@RequestBody BranchDTO branchDTO) throws Exception {
        BranchDTO createdBranch = branchService.createBranch(branchDTO);
        return ResponseEntity.ok(createdBranch);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchDTO> getBranchById(@PathVariable Long id) throws Exception {
        BranchDTO createdBranch = branchService.getBranchById(id);
        return ResponseEntity.ok(createdBranch);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BranchDTO>> getAllBranchesByStoreId(@PathVariable Long storeId) throws Exception {
        List<BranchDTO> createdBranch = branchService.getAllBranchesByStoreId(storeId);
        return ResponseEntity.ok(createdBranch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchDTO> updateBranch(@PathVariable Long id, @RequestBody BranchDTO branchDTO) throws Exception {
        BranchDTO createdBranch = branchService.updateBranch(id, branchDTO);
        return ResponseEntity.ok(createdBranch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteBranchById(@PathVariable Long id) throws Exception {
        branchService.deleteBranch(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("branch deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    // NEW — admin-only cleanup endpoint that wipes the branch and everything under it
    @DeleteMapping("/{id}/force")
    public ResponseEntity<ApiResponse> forceDeleteBranchById(@PathVariable Long id) throws Exception {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new Exception("only an admin can force-delete a branch");
        }
        branchService.forceDeleteBranch(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("branch and all its data deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}