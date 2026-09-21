package com.usshh.mapper;

import com.usshh.model.Order;
import com.usshh.payload.dto.OrderDTO;

import java.util.Collections;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .note(order.getNote())
                .branchId(order.getBranch() != null ? order.getBranch().getId() : null)
                .branch(order.getBranch() != null ? BranchMapper.toDTO(order.getBranch()) : null)
                .cashier(order.getCashier() != null ? UserMapper.toDTO(order.getCashier()) : null)
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customer(order.getCustomer() != null ? CustomerMapper.toDTO(order.getCustomer()) : null)
                .paymentType(order.getPaymentType())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(order.getItems() == null
                        ? Collections.emptyList()
                        : order.getItems().stream()
                        .map(OrderItemMapper::toDTO)
                        .collect(Collectors.toList()))
                .build();
    }
}