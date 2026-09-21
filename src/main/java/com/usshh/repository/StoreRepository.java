package com.usshh.repository;

import com.usshh.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository <Store, Long>{

    Store findByStoreAdminId(Long adminId);

}
