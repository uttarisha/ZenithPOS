package com.usshh.mapper;

import com.usshh.model.Category;
import com.usshh.payload.dto.CategoryDTO;

public class CategoryMapper {

    public static CategoryDTO toDTO(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryDTO.builder()
                .id(category.getId()) // Added missing category ID mapping
                .name(category.getName())
                .storeId(category.getStore() != null ? category.getStore().getId() : null)
                .build();
    }
}