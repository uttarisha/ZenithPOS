package com.usshh.service;

import com.usshh.domain.StoreStatus;
import com.usshh.model.User;
import com.usshh.payload.dto.StoreDTO;
import com.usshh.payload.dto.StoreRevenueDTO;

import java.util.List;

public interface StoreService {

    StoreDTO createStore(StoreDTO storeDTO, User user);
    StoreDTO getStoreById(Long id) throws Exception;
    List<StoreDTO> getAllStores();
    StoreDTO getStoreByAdmin() throws Exception;
    StoreDTO updateStore(Long id, StoreDTO storeDTO) throws Exception;
    void deleteStore(Long id) throws Exception;
    void forceDeleteStore(Long id) throws Exception; // NEW
    StoreDTO getStoreByEmployee() throws Exception;
    StoreDTO moderateStore(Long id, StoreStatus status) throws Exception;
    StoreRevenueDTO getStoreRevenueSummary() throws Exception;
}