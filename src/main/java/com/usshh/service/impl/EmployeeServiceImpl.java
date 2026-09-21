package com.usshh.service.impl;

import com.usshh.domain.UserRole;
import com.usshh.mapper.UserMapper;
import com.usshh.model.Branch;
import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;
import com.usshh.repository.BranchRepository;
import com.usshh.repository.StoreRepository;
import com.usshh.repository.UserRepository;
import com.usshh.service.EmployeeService;
import com.usshh.service.UserService;   // NEW
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {


    private static final Set<UserRole> EMPLOYEE_ALLOWED_ROLES = Set.of(
            UserRole.ROLE_STORE_MANAGER,
            UserRole.ROLE_BRANCH_MANAGER,
            UserRole.ROLE_BRANCH_CASHIER
    );

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;   // NEW


    private void validateEmployeeRole(UserRole role) throws Exception {
        if (role == null || !EMPLOYEE_ALLOWED_ROLES.contains(role)) {
            throw new Exception("this role cannot be assigned to an employee");
        }
    }

    @Override
    public UserDTO createStoreEmployee(UserDTO employee, Long storeId) throws Exception {
        validateEmployeeRole(employee.getRole());

        // NEW: friendly message instead of a database error
        if (userRepository.findByEmail(employee.getEmail()) != null) {
            throw new Exception("An account with this email already exists.");
        }

        Store store = storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("Store not found")
        );

        Branch branch = null;

        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
            if (employee.getBranchId() == null) {
                throw new Exception("branch id is required to create branch manager");
            }

            branch = branchRepository.findById(employee.getBranchId()).orElseThrow(
                    () -> new Exception("branch not found")
            );
        }

        User user = UserMapper.toEntity(employee);
        user.setStore(store);
        user.setBranch(branch);
        user.setPassword(passwordEncoder.encode(employee.getPassword()));

        User savedEmployee = userRepository.save(user);
        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER && branch != null) {
            branch.setManager(savedEmployee);
            branchRepository.save(branch);
        }
        return UserMapper.toDTO(savedEmployee);
    }

    @Override
    public UserDTO createBranchEmployee(UserDTO employee, Long branchId) throws Exception {

        Branch branch = branchRepository.findById(branchId).orElseThrow(
                () -> new Exception("branch not found")
        );

        if (employee.getRole() == UserRole.ROLE_BRANCH_CASHIER ||
                employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {

            // NEW: friendly message that points to the new feature
            if (userRepository.findByEmail(employee.getEmail()) != null) {
                throw new Exception(
                        "An account with this email already exists. "
                                + "If the person already signed up, use \"Existing account\" instead.");
            }

            User user = UserMapper.toEntity(employee);
            user.setBranch(branch);
            user.setStore(branch.getStore());
            user.setPassword(passwordEncoder.encode(employee.getPassword()));

            User savedUser = userRepository.save(user);
            if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
                branch.setManager(savedUser);
                branchRepository.save(branch);
            }
            return UserMapper.toDTO(savedUser);
        }
        throw new Exception("branch role not supported");
    }

    // NEW: attach an account that already signed up to a branch
    @Override
    public UserDTO assignExistingEmployee(Long branchId, String email, UserRole role) throws Exception {
        if (email == null || email.isBlank()) {
            throw new Exception("email is required");
        }
        if (role != UserRole.ROLE_BRANCH_MANAGER && role != UserRole.ROLE_BRANCH_CASHIER) {
            throw new Exception("only branch managers and cashiers can be assigned to a branch");
        }

        Branch branch = branchRepository.findById(branchId).orElseThrow(
                () -> new Exception("branch not found")
        );

        checkCanAssign(branch, role);

        User target = userRepository.findByEmail(email.trim());
        if (target == null) {
            throw new Exception("No account found with this email. Ask the person to sign up first.");
        }

        String label = role == UserRole.ROLE_BRANCH_MANAGER ? "a Branch Manager" : "a Cashier";
        if (target.getRole() != role) {
            throw new Exception("This account is not registered as " + label
                    + ", so it cannot be assigned here.");
        }
        if (target.getBranch() != null || target.getStore() != null) {
            throw new Exception("This account is already assigned to a branch.");
        }

        target.setBranch(branch);
        target.setStore(branch.getStore());
        User saved = userRepository.save(target);

        if (role == UserRole.ROLE_BRANCH_MANAGER) {
            // if the branch already had a manager, that person becomes unassigned again
            User previous = branch.getManager();
            if (previous != null && previous.getId() != saved.getId()) {
                previous.setBranch(null);
                previous.setStore(null);
                userRepository.save(previous);
            }
            branch.setManager(saved);
            branchRepository.save(branch);
        }

        return UserMapper.toDTO(saved);
    }

    private void checkCanAssign(Branch branch, UserRole role) throws Exception {
        User current = userService.getCurrentUser();

        if (current.getRole() == UserRole.ROLE_ADMIN) {
            return;
        }

        // the store admin who owns this branch's store
        if (current.getRole() == UserRole.ROLE_STORE_ADMIN) {
            Store store = storeRepository.findByStoreAdminId(current.getId());
            if (store != null && branch.getStore() != null
                    && store.getId().equals(branch.getStore().getId())) {
                return;
            }
        }

        if (role == UserRole.ROLE_BRANCH_CASHIER
                && current.getRole() == UserRole.ROLE_BRANCH_MANAGER
                && current.getBranch() != null
                && current.getBranch().getId().equals(branch.getId())) {
            return;
        }

        throw new Exception("You are not allowed to assign staff to this branch");
    }

    @Override
    public User updateEmployee(Long employeeId, UserDTO employeeDetails) throws Exception {
        User existingEmployee = userRepository.findById(employeeId).orElseThrow(
                () -> new Exception("employee not exist with given id")
        );

        if (existingEmployee.getRole() == UserRole.ROLE_ADMIN) {
            throw new Exception("admin account cannot be modified here");
        }
        validateEmployeeRole(employeeDetails.getRole());

        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setFullName(employeeDetails.getFullName());
        if (employeeDetails.getPhone() != null) {
            existingEmployee.setPhone(employeeDetails.getPhone());
        }
        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isBlank()) {
            existingEmployee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }
        existingEmployee.setRole(employeeDetails.getRole());

        if (employeeDetails.getBranchId() != null) {
            Branch branch = branchRepository.findById(employeeDetails.getBranchId())
                    .orElseThrow(() -> new Exception("branch not found"));
            existingEmployee.setBranch(branch);
            existingEmployee.setStore(branch.getStore());
        }

        return userRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(Long employeeId) throws Exception {
        User employee = userRepository.findById(employeeId).orElseThrow(
                () -> new Exception("employee not found")
        );


        if (employee.getRole() == UserRole.ROLE_ADMIN) {
            throw new Exception("admin account cannot be deleted");
        }

        userRepository.delete(employee);
    }

    @Override
    public List<UserDTO> findStoreEmployees(Long storeId, UserRole role) throws Exception {
        Store store = storeRepository.findById(storeId).orElseThrow(
                () -> new Exception("Store not found")
        );

        return userRepository.findByStore(store).stream()
                .filter(user -> role == null || user.getRole() == role)
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> findBranchEmployees(Long branchId, UserRole role) throws Exception {
        Branch branch = branchRepository.findById(branchId).orElseThrow(
                () -> new Exception("branch not found")
        );

        return userRepository.findByBranchId(branchId)
                .stream().filter(
                        user -> role == null || user.getRole() == role
                )
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }
}