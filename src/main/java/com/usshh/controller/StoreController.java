package com.usshh.controller;

import com.usshh.domain.StoreStatus;
import com.usshh.exceptions.UserException;
import com.usshh.model.User;
import com.usshh.payload.dto.StoreDTO;
import com.usshh.payload.dto.StoreRevenueDTO;
import com.usshh.payload.response.ApiResponse;
import com.usshh.service.StoreService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO,
                                                @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwtToken(jwt);
        return ResponseEntity.ok(storeService.createStore(storeDTO, user));
    }

    @GetMapping
    public ResponseEntity<List<StoreDTO>> getAllStore() throws Exception {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/admin")
    public ResponseEntity<StoreDTO> getStoreByAdmin() throws Exception {
        return ResponseEntity.ok(storeService.getStoreByAdmin());
    }

    @GetMapping("/employee")
    public ResponseEntity<StoreDTO> getStoreByEmployee() throws Exception {
        return ResponseEntity.ok(storeService.getStoreByEmployee());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreDTO> updateStore(@PathVariable Long id,
                                                @RequestBody StoreDTO storeDTO) throws Exception {
        return ResponseEntity.ok(storeService.updateStore(id, storeDTO));
    }

    @PutMapping("/{id}/moderate")
    public ResponseEntity<StoreDTO> moderateStore(@PathVariable Long id,
                                                  @RequestParam StoreStatus status) throws Exception {
        return ResponseEntity.ok(storeService.moderateStore(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteStore(@PathVariable Long id) throws Exception {
        storeService.deleteStore(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Store deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/force")
    public ResponseEntity<ApiResponse> forceDeleteStore(@PathVariable Long id) throws Exception {
        storeService.forceDeleteStore(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Store and all its data deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/revenue-summary")
    public ResponseEntity<StoreRevenueDTO> getStoreRevenueSummary() throws Exception {
        return ResponseEntity.ok(storeService.getStoreRevenueSummary());
    }
}