package com.usshh.service;

import com.usshh.payload.dto.ShiftReportDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface ShiftReportService {

    ShiftReportDTO startShift() throws Exception;

    ShiftReportDTO endShift(LocalDateTime shiftEnd) throws Exception;

    ShiftReportDTO getShiftReportById(Long id) throws Exception;

    List<ShiftReportDTO> getAllShiftReports();

    List<ShiftReportDTO> getShiftReportsByBranchId(Long branchId);
    List<ShiftReportDTO> getShiftReportsByCashierId(Long cashierId);

    ShiftReportDTO getCurrentShiftProgress() throws Exception;

    ShiftReportDTO getShiftByCashierAndDate(Long cashierId, LocalDateTime date) throws Exception;
}