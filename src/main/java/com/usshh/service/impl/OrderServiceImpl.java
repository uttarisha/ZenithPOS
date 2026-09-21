package com.usshh.service.impl;

import com.usshh.domain.OrderStatus;
import com.usshh.domain.PaymentType;
import com.usshh.mapper.OrderMapper;
import com.usshh.model.*;
import com.usshh.payload.dto.OrderDTO;
import com.usshh.repository.CustomerRepository;
import com.usshh.repository.OrderRepository;
import com.usshh.repository.ProductRepository;
import com.usshh.repository.ShiftReportRepository;
import com.usshh.service.CustomerService;
import com.usshh.service.OrderService;
import com.usshh.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final double TAX_RATE = 0.10;

    private final UserService userService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ShiftReportRepository shiftReportRepository;
    private final CustomerService customerService;

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double calculateDiscount(OrderDTO dto, double subtotal, double grossTotal) {
        double value = dto.getDiscountValue() != null ? dto.getDiscountValue() : 0;
        if (value < 0) {
            throw new IllegalArgumentException("discount cannot be negative");
        }
        if (value == 0) {
            return 0;
        }

        double discount;
        if ("PERCENT".equalsIgnoreCase(dto.getDiscountType())) {
            if (value > 100) {
                throw new IllegalArgumentException("discount percentage cannot be more than 100");
            }
            discount = subtotal * value / 100.0;
        } else {
            discount = value;
        }
        return round2(Math.min(discount, grossTotal));
    }

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) throws Exception {
        User cashier = userService.getCurrentUser();

        Branch branch = cashier.getBranch();
        if (branch == null) {
            throw new Exception("cashier's branch not found");
        }

        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            throw new Exception("order must contain at least one item");
        }

        Customer customer = null;
        if (orderDTO.getCustomerId() != null) {
            customer = customerRepository.findById(orderDTO.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "customer not found with id " + orderDTO.getCustomerId()));
        }

        if (customer != null) {
            Store customerStore = customer.getStore();
            if (customerStore == null || branch.getStore() == null
                    || !customerStore.getId().equals(branch.getStore().getId())) {
                throw new Exception("This customer does not belong to your store");
            }
        }

        PaymentType paymentType =
                orderDTO.getPaymentType() != null ? orderDTO.getPaymentType() : PaymentType.CASH;

        Order order = Order.builder()
                .branch(branch)
                .cashier(cashier)
                .customer(customer)
                .paymentType(paymentType)
                .status(OrderStatus.COMPLETED)
                .build();

        List<OrderItem> orderItems = orderDTO.getItems().stream().map(
                itemDto -> {
                    if (itemDto.getQuantity() == null || itemDto.getQuantity() <= 0) {
                        throw new IllegalArgumentException(
                                "item quantity must be a positive number");
                    }

                    Product product = productRepository.findById(itemDto.getProductId())
                            .orElseThrow(() -> new EntityNotFoundException("product not found"));

                    return OrderItem.builder()
                            .product(product)
                            .quantity(itemDto.getQuantity())
                            .price(product.getSellingPrice() * itemDto.getQuantity())
                            .order(order)
                            .build();
                }
        ).toList();

        double subtotal = round2(orderItems.stream().mapToDouble(OrderItem::getPrice).sum());
        double taxAmount = round2(subtotal * TAX_RATE);
        double grossTotal = subtotal + taxAmount;
        double discountAmount = calculateDiscount(orderDTO, subtotal, grossTotal);
        double total = round2(Math.max(0, grossTotal - discountAmount));

        String note = orderDTO.getNote() != null ? orderDTO.getNote().trim() : "";
        if (note.length() > 500) {
            note = note.substring(0, 500);
        }

        order.setSubtotal(subtotal);
        order.setTaxAmount(taxAmount);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(total);
        order.setNote(note.isEmpty() ? null : note);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toDTO(savedOrder);
    }

    @Override
    public OrderDTO getOrderById(Long id) throws Exception {
        return orderRepository.findById(id)
                .map(OrderMapper::toDTO)
                .orElseThrow(
                        () -> new Exception("order not found with id " + id)
                );
    }

    @Override
    public List<OrderDTO> getOrdersByBranch(Long branchId,
                                            Long customerId,
                                            Long cashierId,
                                            PaymentType paymentType,
                                            OrderStatus status) throws Exception {
        return orderRepository.findByBranchId(branchId).stream()
                .filter(order -> customerId == null ||
                        (order.getCustomer() != null &&
                                Objects.equals(order.getCustomer().getId(), customerId)))
                .filter(order -> cashierId == null ||
                        (order.getCashier() != null &&
                                Objects.equals(order.getCashier().getId(), cashierId)))
                .filter(order -> paymentType == null ||
                        order.getPaymentType() == paymentType)
                .filter(order -> status == null ||
                        order.getStatus() == status)
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrderByCashier(Long cashierId) {
        return orderRepository.findByCashierId(cashierId).stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteOrder(Long id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new Exception("order not found with id " + id)
        );

        List<ShiftReport> reports = shiftReportRepository.findAll().stream()
                .filter(r -> r.getRecentOrders() != null && r.getRecentOrders().contains(order))
                .toList();
        for (ShiftReport report : reports) {
            report.getRecentOrders().remove(order);
            shiftReportRepository.save(report);
        }

        orderRepository.delete(order);
    }

    @Override
    public List<OrderDTO> getTodayOrdersByBranch(Long branchId) throws Exception {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return orderRepository.findByBranchIdAndCreatedAtBetween(
                branchId, start, end
        ).stream().map(
                OrderMapper::toDTO
        ).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrdersByCustomerId(Long customerId) throws Exception {
        customerService.getCustomer(customerId);

        return orderRepository.findByCustomerId(customerId)
                .stream().map(
                        OrderMapper::toDTO
                ).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getTop5RecentOrdersByBranchId(Long branchId) throws Exception {
        return orderRepository.findTop5ByBranchIdOrderByCreatedAtDesc(branchId)
                .stream().map(
                        OrderMapper::toDTO
                ).collect(Collectors.toList());
    }

    @Override
    public OrderDTO updateOrderStatus(Long id, OrderStatus status) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(
                () -> new Exception("order not found with id " + id)
        );
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.toDTO(updatedOrder);
    }
}