package com.usshh.payload.dto;

import com.usshh.model.Order;
import com.usshh.model.Product;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;

    private Integer quantity;

    private Double price;

    private ProductDTO product;

    private Long productId;

    private Long orderId;


}
