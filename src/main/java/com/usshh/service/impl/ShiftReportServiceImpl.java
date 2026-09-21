package com.usshh.service.impl;

import com.usshh.domain.PaymentType;
import com.usshh.mapper.ShiftReportMapper;
import com.usshh.model.*;
import com.usshh.payload.dto.ShiftReportDTO;
import com.usshh.repository.OrderRepository;
import com.usshh.repository.RefundRepository;
import com.usshh.repository.ShiftReportRepository;
import com.usshh.repository.UserRepository;
import com.usshh.service.ShiftReportService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftReportServiceImpl implements ShiftReportService {

    private final ShiftReportRepository shiftReportRepository;
    private final UserService userService;
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public ShiftReportDTO startShift() throws Exception {
        User currentUser = userService.getCurrentUser();
        LocalDateTime actualStart = LocalDateTime.now();
        LocalDateTime startOfDay = actualStart.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = actualStart.withHour(23).withMinute(59).withSecond(59);

        Optional<ShiftReport> existing = shiftReportRepository.findByCashierAndShiftStartBetween(
                currentUser, startOfDay, endOfDay
        );
        if (existing.isPresent()) {
            throw new Exception("Shift already started today");
        }

        Branch branch = currentUser.getBranch();
        if (branch == null) {
            throw new Exception("Logged in cashier is not assigned to any branch");
        }

        ShiftReport shiftReport = ShiftReport.builder()
                .cashier(currentUser)
                .shiftStart(actualStart)
                .branch(branch)
                .totalSales(0.0)
                .totalRefunds(0.0)
                .netSale(0.0)
                .totalOrders(0)
                .build();

        ShiftReport savedReport = shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toDTO(savedReport);
    }

    @Override
    public ShiftReportDTO endShift(LocalDateTime shiftEnd) throws Exception {
        User currentUser = userService.getCurrentUser();
        ShiftReport shiftReport = shiftReportRepository
                .findTopByCashierIdAndShiftEndIsNullOrderByShiftStartDesc(currentUser.getId())
                .orElseThrow(() -> new Exception("No active shift to end"));

        shiftReport.setShiftEnd(shiftEnd != null ? shiftEnd : LocalDateTime.now());

        applyLiveTotals(shiftReport, shiftReport.getShiftEnd());

        ShiftReport savedReport = shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toDTO(savedReport);
    }

    @Override
    public ShiftReportDTO getShiftReportById(Long id) throws Exception {
        ShiftReport report = shiftReportRepository.findById(id)
                .orElseThrow(() -> new Exception("shift report not found with given id " + id));
        return ShiftReportMapper.toDTO(withLiveTotalsIfOngoing(report));
    }

    @Override
    public List<ShiftReportDTO> getAllShiftReports() {
        List<ShiftReport> reports = shiftReportRepository.findAll();
        return reports.stream()
                .map(this::withLiveTotalsIfOngoing)
                .map(ShiftReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDTO> getShiftReportsByBranchId(Long branchId) {
        List<ShiftReport> reports = shiftReportRepository.findByBranchId(branchId);
        return reports.stream()
                .map(this::withLiveTotalsIfOngoing)
                .map(ShiftReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDTO> getShiftReportsByCashierId(Long cashierId) {
        List<ShiftReport> reports = shiftReportRepository.findByCashierId(cashierId);
        return reports.stream()
                .map(this::withLiveTotalsIfOngoing)
                .map(ShiftReportMapper::toDTO)
                .collect(Collectors.toList());
    }

    // FIXED: no active shift is a normal state, not an error — return null instead of throwing
    @Override
    public ShiftReportDTO getCurrentShiftProgress() throws Exception {
        User user = userService.getCurrentUser();
        Optional<ShiftReport> activeShift = shiftReportRepository
                .findTopByCashierIdAndShiftEndIsNullOrderByShiftStartDesc(user.getId());
        if (activeShift.isEmpty()) {
            return null;
        }
        ShiftReport shiftReport = activeShift.get();
        applyLiveTotals(shiftReport, LocalDateTime.now());
        return ShiftReportMapper.toDTO(shiftReport);
    }

    @Override
    public ShiftReportDTO getShiftByCashierAndDate(Long cashierId,
                                                   LocalDateTime date) throws Exception {
        User cashier = userRepository.findById(cashierId).orElseThrow(
                () -> new Exception("cashier not found with given id " + cashierId)
        );
        LocalDateTime start = date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = date.withHour(23).withMinute(59).withSecond(59);
        ShiftReport report = shiftReportRepository.findByCashierAndShiftStartBetween(
                cashier, start, end
        ).orElseThrow(() -> new Exception("shift report not found for cashier"));
        return ShiftReportMapper.toDTO(withLiveTotalsIfOngoing(report));
    }


    private ShiftReport withLiveTotalsIfOngoing(ShiftReport shiftReport) {
        if (shiftReport.getShiftEnd() == null) {
            applyLiveTotals(shiftReport, LocalDateTime.now());
        }
        return shiftReport;
    }


    private void applyLiveTotals(ShiftReport shiftReport, LocalDateTime asOf) {
        User cashier = shiftReport.getCashier();

        List<Order> orders = orderRepository.findByCashierAndCreatedAtBetween(
                cashier, shiftReport.getShiftStart(), asOf
        );
        List<Refund> refunds = refundRepository.findByCashierIdAndCreatedAtBetween(
                cashier.getId(), shiftReport.getShiftStart(), asOf
        );

        double totalRefunds = refunds.stream()
                .mapToDouble(refund -> refund.getAmount() != null ? refund.getAmount() : 0.0)
                .sum();
        double totalSales = orders.stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();
        int totalOrders = orders.size();
        double netSales = totalSales - totalRefunds;

        shiftReport.setTotalRefunds(totalRefunds);
        shiftReport.setTotalSales(totalSales);
        shiftReport.setTotalOrders(totalOrders);
        shiftReport.setNetSale(netSales);
        shiftReport.setRecentOrders(getRecentOrders(orders));
        shiftReport.setTopSellingProducts(getTopSellingProducts(orders));
        shiftReport.setPaymentSummaries(getPaymentSummaries(orders, totalSales));
        shiftReport.setRefunds(refunds);
    }

    private List<Order> getRecentOrders(List<Order> orders) {
        if (orders == null || orders.isEmpty()) return Collections.emptyList();
        return orders.stream()
                .sorted(Comparator.comparing(Order::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<Product> getTopSellingProducts(List<Order> orders) {
        if (orders == null || orders.isEmpty()) return Collections.emptyList();
        Map<Product, Integer> productSalesMap = new HashMap<>();
        for (Order order : orders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    if (product != null) {
                        productSalesMap.put(product,
                                productSalesMap.getOrDefault(product, 0) + item.getQuantity());
                    }
                }
            }
        }
        return productSalesMap.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<PaymentSummary> getPaymentSummaries(List<Order> orders, double totalSales) {
        if (orders == null || orders.isEmpty()) return Collections.emptyList();
        Map<PaymentType, List<Order>> grouped = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getPaymentType() != null ?
                        order.getPaymentType() : PaymentType.CASH));
        List<PaymentSummary> summaries = new ArrayList<>();
        for (Map.Entry<PaymentType, List<Order>> entry : grouped.entrySet()) {
            double amount = entry.getValue().stream()
                    .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                    .sum();
            int transactions = entry.getValue().size();
            double percent = totalSales > 0 ? (amount / totalSales) * 100 : 0.0;
            summaries.add(PaymentSummary.builder()
                    .type(entry.getKey())
                    .totalAmount(amount)
                    .transactionCount(transactions)
                    .percentage(percent)
                    .build());
        }
        return summaries;
    }
}