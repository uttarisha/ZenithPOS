package com.usshh.service.impl;

import com.usshh.exceptions.UserException;
import com.usshh.mapper.BranchMapper;
import com.usshh.model.Branch;
import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.BranchDTO;
import com.usshh.repository.*;
import com.usshh.service.BranchService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;

    // NEW — needed to clear out everything under a branch before it can be removed
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;
    private final ShiftReportRepository shiftReportRepository;
    private final UserRepository userRepository;

    @Override
    public BranchDTO createBranch(BranchDTO branchDTO) throws UserException {
        User currentUser = userService.getCurrentUser();
        Store store = storeRepository.findByStoreAdminId(currentUser.getId());

        Branch branch = BranchMapper.toEntity(branchDTO, store);
        Branch savedBranch = branchRepository.save(branch);
        return BranchMapper.toDTO(savedBranch);
    }

    @Override
    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist...")
        );

        exiting.setName(branchDTO.getName());
        exiting.setWorkingDays(branchDTO.getWorkingDays());
        exiting.setEmail(branchDTO.getEmail());
        exiting.setPhone(branchDTO.getPhone());
        exiting.setAddress(branchDTO.getAddress());
        exiting.setOpenTime(branchDTO.getOpenTime());
        exiting.setCloseTime(branchDTO.getCloseTime());
        exiting.setUpdatedAt(LocalDateTime.now());

        Branch updatedBranch = branchRepository.save(exiting);
        return BranchMapper.toDTO(updatedBranch);
    }

    @Override
    public void deleteBranch(Long id) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist...")
        );
        branchRepository.delete(exiting);
    }


    @Override
    @Transactional
    public void forceDeleteBranch(Long id) throws Exception {
        Branch branch = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist...")
        );

        // 1. Refunds reference Order + ShiftReport + Branch + User — delete first
        refundRepository.deleteAll(refundRepository.findByBranchId(id));

        // 2. Orders reference Branch — OrderItems cascade automatically (cascade=ALL)
        orderRepository.deleteAll(orderRepository.findByBranchId(id));

        // 3. Inventory references Branch
        inventoryRepository.deleteAll(inventoryRepository.findByBranchId(id));

        // 4. Shift reports reference Branch
        shiftReportRepository.deleteAll(shiftReportRepository.findByBranchId(id));

        // 5. Employees assigned to this branch — skip the branch's own manager,
        //    since Branch.manager cascades on delete below and would otherwise
        //    get deleted twice
        long managerId = branch.getManager() != null ? branch.getManager().getId() : -1L;
        List<User> employees = userRepository.findByBranchId(id);
        for (User employee : employees) {
            if (employee.getId() != managerId) {
                userRepository.delete(employee);
            }
        }

        // 6. Finally the branch itself — cascades deletion of branch.manager
        branchRepository.delete(branch);
    }

    @Override
    public List<BranchDTO> getAllBranchesByStoreId(Long storeId) {
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        return branches.stream().map(BranchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDTO getBranchById(Long id) throws Exception {
        Branch exiting = branchRepository.findById(id).orElseThrow(
                () -> new Exception("branch not exist...")
        );
        return BranchMapper.toDTO(exiting);
    }
}