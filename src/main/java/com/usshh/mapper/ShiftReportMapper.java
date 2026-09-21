package com.usshh.mapper;

import com.usshh.model.Order;
import com.usshh.model.Product;
import com.usshh.model.Refund;
import com.usshh.model.ShiftReport;
import com.usshh.payload.dto.OrderDTO;
import com.usshh.payload.dto.ProductDTO;
import com.usshh.payload.dto.RefundDTO;
import com.usshh.payload.dto.ShiftReportDTO;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ShiftReportMapper {

    public static ShiftReportDTO toDTO(ShiftReport entity) {
        if (entity == null) {
            return null;
        }

        return ShiftReportDTO.builder()
                .id(entity.getId())
                .shiftEnd(entity.getShiftEnd())
                .shiftStart(entity.getShiftStart())
                .totalSales(entity.getTotalSales())
                .totalRefunds(entity.getTotalRefunds())
                .totalOrders(entity.getTotalOrders())
                .netSale(entity.getNetSale())
                .cashier(entity.getCashier() != null ? UserMapper.toDTO(entity.getCashier()) : null)
                .cashierId(entity.getCashier() != null ? entity.getCashier().getId() : null)
                .branch(entity.getBranch() != null ? BranchMapper.toDTO(entity.getBranch()) : null)
                .branchId(entity.getBranch() != null ? entity.getBranch().getId() : null)
                .recentOrders(mapOrders(entity.getRecentOrders()))
                .topSellingProducts(mapProducts(entity.getTopSellingProducts()))
                .refunds(mapRefunds(entity.getRefunds()))
                .paymentSummaries(entity.getPaymentSummaries() != null
                        ? entity.getPaymentSummaries()
                        : Collections.emptyList())
                .build();
    }

    // FIXED: empty list instead of null, so frontend default params (=[]) actually work
    private static List<RefundDTO> mapRefunds(List<Refund> refunds) {
        if (refunds == null || refunds.isEmpty()) { return Collections.emptyList(); }
        return refunds.stream().map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    private static List<ProductDTO> mapProducts(List<Product> topSellingProducts) {
        if (topSellingProducts == null || topSellingProducts.isEmpty()) { return Collections.emptyList(); }
        return topSellingProducts.stream().map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    private static List<OrderDTO> mapOrders(List<Order> recentOrders) {
        if (recentOrders == null || recentOrders.isEmpty()) { return Collections.emptyList(); }
        return recentOrders.stream()
                .map(OrderMapper::toDTO).collect(Collectors.toList());
    }
}