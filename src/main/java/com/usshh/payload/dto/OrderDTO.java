package com.usshh.payload.dto;

import com.usshh.domain.OrderStatus;
import com.usshh.domain.PaymentType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;

    private Double totalAmount;


    private Double subtotal;
    private Double taxAmount;
    private Double discountAmount;
    private String note;


    private String discountType;
    private Double discountValue;

    private LocalDateTime createdAt;

    private Long branchId;
    private BranchDTO branch;

    private Long customerId;
    private CustomerDTO customer;

    private UserDTO cashier;

    private PaymentType paymentType;

    private OrderStatus status;

    private List<OrderItemDTO> items;
}