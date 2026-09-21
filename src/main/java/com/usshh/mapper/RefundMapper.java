package com.usshh.mapper;

import com.usshh.model.Refund;
import com.usshh.payload.dto.RefundDTO;

public class RefundMapper {

    public static RefundDTO toDTO(Refund refund) {
        if (refund == null) return null;

        return RefundDTO.builder()
                .id(refund.getId())
                .order(refund.getOrder() != null ? OrderMapper.toDTO(refund.getOrder()) : null)
                .orderId(refund.getOrder() != null ? refund.getOrder().getId() : null)
                .reason(refund.getReason())
                .amount(refund.getAmount())
                .cashier(refund.getCashier() != null ? UserMapper.toDTO(refund.getCashier()) : null)
                .cashierName(refund.getCashier() != null ? refund.getCashier().getFullName() : null)
                .branch(refund.getBranch() != null ? BranchMapper.toDTO(refund.getBranch()) : null)
                .branchId(refund.getBranch() != null ? refund.getBranch().getId() : null)
                .shiftReportId(refund.getShiftReport() != null ? refund.getShiftReport().getId() : null)
                .paymentType(refund.getPaymentType())
                .createdAt(refund.getCreatedAt())
                .build();
    }
}