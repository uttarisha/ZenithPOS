package com.usshh.payload.dto;

import lombok.*;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BranchRevenueDTO {
    private Long branchId;
    private String branchName;
    private Double totalSales;
    private Double totalRefunds;
    private Double netRevenue;
    private int totalOrders;
}