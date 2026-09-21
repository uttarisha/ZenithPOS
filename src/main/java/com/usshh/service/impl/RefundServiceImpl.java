package com.usshh.service.impl;

import com.usshh.mapper.RefundMapper;
import com.usshh.model.Branch;
import com.usshh.model.Order;
import com.usshh.model.Refund;
import com.usshh.model.User;
import com.usshh.payload.dto.RefundDTO;
import com.usshh.repository.OrderRepository;
import com.usshh.repository.RefundRepository;
import com.usshh.service.RefundService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final UserService userService;
    private final OrderRepository orderRepository;
    private final RefundRepository refundRepository;

    @Override
    public RefundDTO createRefund(RefundDTO refund) throws Exception {
        User cashier = userService.getCurrentUser();

        if (refund.getOrderId() == null) {
            throw new Exception("orderId is required");
        }
        if (refund.getAmount() == null || refund.getAmount() <= 0) {
            throw new Exception("refund amount must be greater than zero");
        }

        Order order = orderRepository.findById(refund.getOrderId()).orElseThrow(
                () -> new Exception("Order not found")
        );

        Branch branch = order.getBranch();

        // A cashier can only refund orders from their own branch.
        if (branch == null || cashier.getBranch() == null
                || !branch.getId().equals(cashier.getBranch().getId())) {
            throw new Exception("you cannot refund an order from a different branch");
        }

        // Prevent refunding more than the order's total, across all
        // refunds already issued for this order.
        List<Refund> existingRefunds = refundRepository.findByOrderId(order.getId());
        double alreadyRefunded = existingRefunds.stream()
                .mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0)
                .sum();

        if (alreadyRefunded + refund.getAmount() > order.getTotalAmount()) {
            throw new Exception("refund amount exceeds the order's remaining refundable total");
        }

        Refund createdRefund = Refund.builder()
                .order(order)
                .cashier(cashier)
                .branch(branch)
                .reason(refund.getReason())
                .amount(refund.getAmount())
                .paymentType(order.getPaymentType())
                .build();

        Refund savedRefund = refundRepository.save(createdRefund);
        return RefundMapper.toDTO(savedRefund);
    }

    @Override
    public List<RefundDTO> getAllRefunds() throws Exception {
        return refundRepository.findAll().stream()
                .map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByCashier(Long cashierId) throws Exception {
        return refundRepository.findByCashierId(cashierId).stream()
                .map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByShiftReport(Long shiftReportId) throws Exception {
        return refundRepository.findByShiftReportId(shiftReportId).stream()
                .map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByCashierAndDateRange(Long cashierId,
                                                          LocalDateTime startDate,
                                                          LocalDateTime endDate) throws Exception {
        return refundRepository.findByCashierIdAndCreatedAtBetween(
                cashierId, startDate, endDate
        ).stream().map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<RefundDTO> getRefundByBranch(Long branchId) throws Exception {
        return refundRepository.findByBranchId(branchId).stream()
                .map(RefundMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public RefundDTO getRefundById(Long refundId) throws Exception {
        return refundRepository.findById(refundId)
                .map(RefundMapper::toDTO).orElseThrow(
                        () -> new Exception("Refund not found")
                );
    }

    @Override
    public void deleteRefund(Long refundId) throws Exception {
        User currentUser = userService.getCurrentUser();

        // Deleting a financial record should be restricted — adjust the
        // role check to whichever role your business rules require.
        if (currentUser.getRole() != com.usshh.domain.UserRole.ROLE_ADMIN) {
            throw new Exception("you do not have permission to delete a refund");
        }

        this.getRefundById(refundId);
        refundRepository.deleteById(refundId);
    }
}