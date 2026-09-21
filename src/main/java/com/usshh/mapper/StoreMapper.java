package com.usshh.mapper;

import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.StoreDTO;

public class StoreMapper {

    public static StoreDTO toDTO(Store store) {
        if (store == null) return null;

        StoreDTO storeDTO = new StoreDTO();
        storeDTO.setId(store.getId());
        storeDTO.setBrand(store.getBrand());
        storeDTO.setDescription(store.getDescription());
        storeDTO.setStoreAdmin(
                store.getStoreAdmin() != null ? UserMapper.toDTO(store.getStoreAdmin()) : null
        );
        storeDTO.setStoreType(store.getStoreType());
        storeDTO.setContact(store.getContact());
        storeDTO.setCreatedAt(store.getCreatedAt());
        storeDTO.setUpdatedAt(store.getUpdatedAt());
        storeDTO.setStatus(store.getStatus());
        return storeDTO;
    }

    public static Store toEntity(StoreDTO storeDTO, User storeAdmin) {
        Store store = new Store();
        store.setBrand(storeDTO.getBrand());
        store.setDescription(storeDTO.getDescription());
        store.setStoreAdmin(storeAdmin);
        store.setStoreType(storeDTO.getStoreType());
        store.setContact(storeDTO.getContact());
        return store;
    }
}