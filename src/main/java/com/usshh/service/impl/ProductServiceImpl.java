package com.usshh.service.impl;

import com.usshh.mapper.ProductMapper;
import com.usshh.model.Category;
import com.usshh.model.Product;
import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.ProductDTO;
import com.usshh.repository.CategoryRepository;
import com.usshh.repository.ProductRepository;
import com.usshh.repository.StoreRepository;
import com.usshh.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductDTO createProduct(ProductDTO productDTO, User user) throws Exception {
        Store store = storeRepository.findById(
                productDTO.getStoreId()
        ).orElseThrow(
                () -> new Exception("Store not found")
        );

        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(
                () -> new Exception("Category not found")
        );

        Product product= ProductMapper.toEntity(productDTO, store, category);
        Product savedProduct=productRepository.save(product);
        return ProductMapper.toDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                ()-> new Exception("product not found")
        );

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setSku(productDTO.getSku());
        if (productDTO.getImage() != null) {
            product.setImage(productDTO.getImage());
        }
        if (productDTO.getMrp() != null) {
            product.setMrp(productDTO.getMrp());
        }
        if (productDTO.getSellingPrice() != null) {
            product.setSellingPrice(productDTO.getSellingPrice());
        }
        if (productDTO.getBrand() != null) {
            product.setBrand(productDTO.getBrand());
        }
        product.setUpdatedAt(LocalDateTime.now());

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(
                    () -> new Exception("category not found")
            );
            product.setCategory(category);
        }

        Product savedProduct=productRepository.save(product);
        return ProductMapper.toDTO(savedProduct);
    }

    @Override
    public void deleteProduct(Long id, User user) throws Exception {

        Product product = productRepository.findById(id).orElseThrow(
                ()-> new Exception("product not found")
        );

        productRepository.delete(product);

    }

    @Override
    public List<ProductDTO> getProductsByStoreId(Long storeId) {
        List<Product> products = productRepository.findByStoreId(storeId);
        return products.stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> searchByKeyword(Long storeId, String keyword) {
        List<Product> products = productRepository.searchByKeyword(storeId, keyword);
        return products.stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());
    }
}
