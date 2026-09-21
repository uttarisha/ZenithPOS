package com.usshh.model;

import jakarta.persistence.*;
import lombok.*;

    @Entity
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class Category {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;

        private String name;

        @ManyToOne(fetch = FetchType.LAZY)
        private Store store;
    }
