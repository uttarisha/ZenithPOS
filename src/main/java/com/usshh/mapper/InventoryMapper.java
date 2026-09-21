package com.usshh.mapper;

import com.usshh.model.Branch;
import com.usshh.model.Inventory;
import com.usshh.model.Product;
import com.usshh.payload.dto.InventoryDTO;

public class InventoryMapper {

    public static InventoryDTO toDTO(Inventory inventory) {
        if (inventory == null) {
            return null;
        }

        return InventoryDTO.builder()
                .id(inventory.getId())
                .branchId(inventory.getBranch() != null ? inventory.getBranch().getId() : null)
                .branch(inventory.getBranch() != null ? BranchMapper.toDTO(inventory.getBranch()) : null) // Fixed: Maps BranchDTO
                .productId(inventory.getProduct() != null ? inventory.getProduct().getId() : null)
                .product(inventory.getProduct() != null ? ProductMapper.toDTO(inventory.getProduct()) : null)
                .quantity(inventory.getQuantity())
                .lastUpdate(inventory.getLastUpdate()) // Fixed: Maps lastUpdate
                .build();
    }

    public static Inventory toEntity(InventoryDTO inventoryDTO,
                                     Branch branch,
                                     Product product) {
        return Inventory.builder()
                .branch(branch)
                .product(product)
                .quantity(inventoryDTO.getQuantity())
                .build();
    }
}