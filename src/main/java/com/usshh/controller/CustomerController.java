package com.usshh.controller;

import com.usshh.payload.dto.CustomerDTO;
import com.usshh.payload.response.ApiResponse;
import com.usshh.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping()
    public ResponseEntity<CustomerDTO> create(@RequestBody CustomerDTO customer) throws Exception {
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(
            @PathVariable Long id,
            @RequestBody CustomerDTO customer) throws Exception {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(
            @PathVariable Long id
    ) throws Exception {
        customerService.deleteCustomer(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Customer deleted");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getById(
            @PathVariable Long id
    ) throws Exception {
        return ResponseEntity.ok(customerService.getCustomer(id));
    }

    @GetMapping()
    public ResponseEntity<List<CustomerDTO>> getAll() throws Exception {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDTO>> search(
            @RequestParam String q
    ) throws Exception {
        return ResponseEntity.ok(customerService.searchCustomers(q));
    }
}