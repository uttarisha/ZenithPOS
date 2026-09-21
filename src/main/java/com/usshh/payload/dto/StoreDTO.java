package com.usshh.payload.dto;

import com.usshh.domain.StoreStatus;
import com.usshh.model.StoreContact;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class StoreDTO {


    private Long id;

    private String brand;

    private UserDTO storeAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private String storeType;

    private StoreStatus status;

    private StoreContact contact;

}
