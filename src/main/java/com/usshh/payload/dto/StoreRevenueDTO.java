package com.usshh.payload.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreRevenueDTO {
    private Long storeId;
    private String storeName;
    private Double totalSales;
    private Double totalRefunds;
    private Double netRevenue;
    private int totalOrders;
    private List<BranchRevenueDTO> branches;
}