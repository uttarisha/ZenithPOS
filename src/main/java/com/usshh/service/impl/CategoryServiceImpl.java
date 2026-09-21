package com.usshh.service.impl;

import com.usshh.domain.UserRole;
import com.usshh.mapper.CategoryMapper;
import com.usshh.model.Category;
import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.CategoryDTO;
import com.usshh.repository.CategoryRepository;
import com.usshh.repository.StoreRepository;
import com.usshh.service.CategoryService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final StoreRepository storeRepository;

    @Override
    public CategoryDTO createCategory(CategoryDTO dto) throws Exception {
        if (dto.getStoreId() == null) {
            throw new IllegalArgumentException("Store ID must not be null");
        }

        User user = userService.getCurrentUser();

        Store store = storeRepository.findById(dto.getStoreId()).orElseThrow(
                () -> new Exception("Store not found with ID: " + dto.getStoreId())
        );

        Category category = Category.builder()
                .store(store)
                .name(dto.getName())
                .build();

        checkAuthority(user, store);
        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public List<CategoryDTO> getCategoriesByStore(Long storeId) {
        List<Category> categories = categoryRepository.findByStoreId(storeId);
        return categories.stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new Exception("Category does not exist with ID: " + id)
        );
        User user = userService.getCurrentUser();

        category.setName(dto.getName());
        checkAuthority(user, category.getStore());
        return CategoryMapper.toDTO(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new Exception("Category does not exist with ID: " + id)
        );
        User user = userService.getCurrentUser();

        checkAuthority(user, category.getStore());
        categoryRepository.delete(category);
    }

    private void checkAuthority(User user, Store store) throws Exception {
        if (user == null || store == null) {
            throw new Exception("User or Store information is missing");
        }

        User storeAdmin = store.getStoreAdmin();

        boolean isAdmin = UserRole.ROLE_STORE_ADMIN.equals(user.getRole());
        boolean isManager = UserRole.ROLE_STORE_MANAGER.equals(user.getRole());

        boolean isSameStore = storeAdmin != null && Objects.equals(user.getId(), storeAdmin.getId());

        if (!(isAdmin && isSameStore) && !isManager) {
            Long adminId = (storeAdmin != null) ? storeAdmin.getId() : null;
            throw new Exception(String.format(
                    "Access Denied: Current User ID = %d (Role: %s) does not match Store Admin ID = %d for Store ID = %d",
                    user.getId(), user.getRole(), adminId, store.getId()
            ));
        }
    }
}