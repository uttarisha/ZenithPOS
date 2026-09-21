package com.usshh.service.impl;

import com.usshh.domain.OrderStatus;
import com.usshh.domain.StoreStatus;
import com.usshh.domain.UserRole;
import com.usshh.mapper.StoreMapper;
import com.usshh.model.*;
import com.usshh.payload.dto.BranchRevenueDTO;
import com.usshh.payload.dto.StoreDTO;
import com.usshh.payload.dto.StoreRevenueDTO;
import com.usshh.repository.*;
import com.usshh.service.BranchService;
import com.usshh.service.StoreService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;
    private final OrderRepository orderRepository;
    private final RefundRepository refundRepository;
    private final BranchRepository branchRepository;
    private final BranchService branchService;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    public StoreDTO createStore(StoreDTO storeDTO, User user) {
        Store store = StoreMapper.toEntity(storeDTO, user);
        return StoreMapper.toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDTO getStoreById(Long id) throws Exception {
        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found...")
        );
        return StoreMapper.toDTO(store);
    }

    @Override
    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll().stream()
                .map(StoreMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StoreDTO getStoreByAdmin() throws Exception {
        User admin = userService.getCurrentUser();
        Store store = storeRepository.findByStoreAdminId(admin.getId());
        if (store == null) {
            throw new Exception("no store found for this admin");
        }
        return StoreMapper.toDTO(store);
    }

    @Override
    public StoreDTO updateStore(Long id, StoreDTO storeDTO) throws Exception {
        User currentUser = userService.getCurrentUser();

        Store existing = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found")
        );

        if (!canManageStore(currentUser, existing)) {
            throw new Exception("you do not have permission to update this store");
        }

        existing.setBrand(storeDTO.getBrand());
        existing.setDescription(storeDTO.getDescription());

        if (storeDTO.getStoreType() != null) {
            existing.setStoreType(storeDTO.getStoreType());
        }

        if (storeDTO.getContact() != null) {
            StoreContact contact = StoreContact.builder()
                    .address(storeDTO.getContact().getAddress())
                    .phone(storeDTO.getContact().getPhone())
                    .email(storeDTO.getContact().getEmail())
                    .build();
            existing.setContact(contact);
        }

        Store updatedStore = storeRepository.save(existing);
        return StoreMapper.toDTO(updatedStore);
    }

    @Override
    public void deleteStore(Long id) throws Exception {
        User currentUser = userService.getCurrentUser();

        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found")
        );

        if (!canManageStore(currentUser, store)) {
            throw new Exception("you do not have permission to delete this store");
        }

        storeRepository.delete(store);
    }


    @Override
    @Transactional
    public void forceDeleteStore(Long id) throws Exception {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new Exception("only an admin can force-delete a store");
        }

        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found")
        );

        // 1. Every branch under this store, fully cleaned out first
        List<Branch> branches = branchRepository.findByStoreId(id);
        for (Branch branch : branches) {
            branchService.forceDeleteBranch(branch.getId());
        }

        // 2. Products reference Category + Store — delete before categories
        productRepository.deleteAll(productRepository.findByStoreId(id));

        // 3. Categories reference Store
        categoryRepository.deleteAll(categoryRepository.findByStoreId(id));

        // 4. Employees still linked directly to the store (not via a branch)
        userRepository.deleteAll(userRepository.findByStore(store));

        // 5. Finally the store itself
        storeRepository.delete(store);
    }

    @Override
    public StoreDTO getStoreByEmployee() throws Exception {
        User currentUser = userService.getCurrentUser();

        Store store = currentUser.getStore();
        if (store == null) {
            throw new Exception("no store assigned to this employee");
        }

        return StoreMapper.toDTO(store);
    }

    @Override
    public StoreDTO moderateStore(Long id, StoreStatus status) throws Exception {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getRole() != UserRole.ROLE_ADMIN) {
            throw new Exception("you do not have permission to moderate stores");
        }

        Store store = storeRepository.findById(id).orElseThrow(
                () -> new Exception("store not found...")
        );

        store.setStatus(status);
        Store updatedStore = storeRepository.save(store);
        return StoreMapper.toDTO(updatedStore);
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Store resolveCurrentStore(User user) throws Exception {
        if (user.getStore() != null) {
            return user.getStore();
        }
        if (user.getRole() == UserRole.ROLE_STORE_ADMIN) {
            Store store = storeRepository.findByStoreAdminId(user.getId());
            if (store != null) {
                return store;
            }
        }
        throw new Exception("You are not assigned to a store yet");
    }

    @Override
    public StoreRevenueDTO getStoreRevenueSummary() throws Exception {
        User user = userService.getCurrentUser();
        Store store = resolveCurrentStore(user);

        List<Branch> branches = branchRepository.findByStoreId(store.getId());

        List<BranchRevenueDTO> branchRevenues = new java.util.ArrayList<>();
        double storeTotalSales = 0;
        double storeTotalRefunds = 0;
        int storeTotalOrders = 0;

        for (Branch branch : branches) {
            List<Order> orders = orderRepository.findByBranchId(branch.getId());
            List<Refund> refunds = refundRepository.findByBranchId(branch.getId());

            double sales = orders.stream()
                    .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                    .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                    .sum();

            double refundTotal = refunds.stream()
                    .mapToDouble(r -> r.getAmount() != null ? r.getAmount() : 0.0)
                    .sum();

            int orderCount = (int) orders.stream()
                    .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                    .count();

            branchRevenues.add(BranchRevenueDTO.builder()
                    .branchId(branch.getId())
                    .branchName(branch.getName())
                    .totalSales(round2(sales))
                    .totalRefunds(round2(refundTotal))
                    .netRevenue(round2(sales - refundTotal))
                    .totalOrders(orderCount)
                    .build());

            storeTotalSales += sales;
            storeTotalRefunds += refundTotal;
            storeTotalOrders += orderCount;
        }

        branchRevenues.sort((a, b) -> Double.compare(b.getNetRevenue(), a.getNetRevenue()));

        return StoreRevenueDTO.builder()
                .storeId(store.getId())
                .storeName(store.getBrand())
                .totalSales(round2(storeTotalSales))
                .totalRefunds(round2(storeTotalRefunds))
                .netRevenue(round2(storeTotalSales - storeTotalRefunds))
                .totalOrders(storeTotalOrders)
                .branches(branchRevenues)
                .build();
    }

    private boolean canManageStore(User currentUser, Store store) {
        if (currentUser.getRole() == UserRole.ROLE_ADMIN) {
            return true;
        }
        return store.getStoreAdmin() != null
                && store.getStoreAdmin().getId() == (currentUser.getId());
    }
}