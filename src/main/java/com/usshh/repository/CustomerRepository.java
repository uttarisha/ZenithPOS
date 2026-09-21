package com.usshh.repository;

import com.usshh.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByStoreId(Long storeId);

    List<Customer> findByBranchId(Long branchId);

    boolean existsByStoreIdAndPhone(Long storeId, String phone);

    // store admin / store manager — whole store, optionally filtered to one branch
    @Query("""
        SELECT c FROM Customer c
        WHERE c.store.id = :storeId
          AND (:branchId IS NULL OR c.branch.id = :branchId)
          AND (LOWER(c.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
            OR c.phone LIKE CONCAT('%', :q, '%'))
        """)
    List<Customer> searchInStore(@Param("storeId") Long storeId,
                                 @Param("branchId") Long branchId,
                                 @Param("q") String q);

    // cashier / branch manager — just their own branch
    @Query("""
        SELECT c FROM Customer c
        WHERE c.branch.id = :branchId
          AND (LOWER(c.fullName) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :q, '%'))
            OR c.phone LIKE CONCAT('%', :q, '%'))
        """)
    List<Customer> searchInBranch(@Param("branchId") Long branchId, @Param("q") String q);
}