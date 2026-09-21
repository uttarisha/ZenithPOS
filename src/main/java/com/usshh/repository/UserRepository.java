package com.usshh.repository;

import com.usshh.domain.UserRole;   // add this import
import com.usshh.model.Store;
import com.usshh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByRole(UserRole role);   

    List<User> findByStore(Store store);
    List<User> findByBranchId(Long branchId);

}