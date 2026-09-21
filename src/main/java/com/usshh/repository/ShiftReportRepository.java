package com.usshh.repository;

import com.usshh.model.ShiftReport;
import com.usshh.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ShiftReportRepository extends JpaRepository<ShiftReport, Long> {

    List<ShiftReport> findByCashierId(Long id);

    List<ShiftReport> findByBranchId(Long id);

    Optional<ShiftReport> findTopByCashierIdAndShiftEndIsNullOrderByShiftStartDesc(Long cashierId);

    Optional<ShiftReport> findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(User cashier);

    Optional<ShiftReport> findByCashierAndShiftStartBetween(User cashier,
                                                            LocalDateTime start,
                                                            LocalDateTime end);
}