package com.usshh.model;

import com.usshh.domain.PaymentType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSummary {

    @Enumerated(EnumType.STRING)
    private PaymentType type;

    private Double totalAmount;
    private Integer transactionCount;
    private Double percentage;
}