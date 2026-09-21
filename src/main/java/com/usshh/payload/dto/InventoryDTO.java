package com.usshh.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDTO {

    private Long id;

    private BranchDTO branch;

    private Long branchId;
    
    private Long productId;

    private ProductDTO product;

    private Integer quantity;

    private LocalDateTime lastUpdate;
}