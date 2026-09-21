package com.usshh.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ShiftReport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime shiftStart;

    private LocalDateTime shiftEnd;

    private Double totalSales;

    private Double totalRefunds;

    private Double netSale;

    private int totalOrders;

    @ManyToOne(fetch = FetchType.LAZY)
    private User cashier;

    @ManyToOne(fetch = FetchType.LAZY)
    private Branch branch;

    @ElementCollection
    @CollectionTable(
            name = "shift_report_payment_summary",
            joinColumns = @JoinColumn(name = "shift_report_id")
    )

    private List<PaymentSummary> paymentSummaries;

    @OneToMany
    private List<Product> topSellingProducts;

    @ManyToMany
    @JoinTable(
            name = "shift_report_recent_orders",
            joinColumns = @JoinColumn(name = "shift_report_id"),
            inverseJoinColumns = @JoinColumn(name = "order_id")
    )

    private List<Order> recentOrders;

    @OneToMany(mappedBy = "shiftReport", cascade = CascadeType.ALL)
    private List<Refund> refunds;

}

