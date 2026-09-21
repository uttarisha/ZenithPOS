package com.usshh.service.impl;

import com.usshh.domain.UserRole;
import com.usshh.mapper.CustomerMapper;
import com.usshh.model.Branch;
import com.usshh.model.Customer;
import com.usshh.model.Store;
import com.usshh.model.User;
import com.usshh.payload.dto.CustomerDTO;
import com.usshh.repository.CustomerRepository;
import com.usshh.repository.StoreRepository;
import com.usshh.service.CustomerService;
import com.usshh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;

    private Store currentStore(User user) throws Exception {
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

    private boolean isBranchLevel(UserRole role) {
        return role == UserRole.ROLE_BRANCH_CASHIER || role == UserRole.ROLE_BRANCH_MANAGER;
    }

    private boolean isStoreLevel(UserRole role) {
        return role == UserRole.ROLE_STORE_ADMIN || role == UserRole.ROLE_STORE_MANAGER;
    }

    // Can this user see this customer, given their role and branch/store?
    private boolean canAccess(User user, Customer customer) throws Exception {
        if (isBranchLevel(user.getRole())) {
            Branch branch = user.getBranch();
            return branch != null && customer.getBranch() != null
                    && customer.getBranch().getId().equals(branch.getId());
        }
        if (isStoreLevel(user.getRole())) {
            Store store = currentStore(user);
            return customer.getStore() != null && customer.getStore().getId().equals(store.getId());
        }
        return false;
    }

    private Customer findOwnCustomer(Long id) throws Exception {
        User user = userService.getCurrentUser();

        Customer customer = customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found")
        );

        if (!canAccess(user, customer)) {
            throw new Exception("Customer not found");
        }
        return customer;
    }

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO) throws Exception {
        User user = userService.getCurrentUser();

        Branch branch = user.getBranch();
        if (branch == null) {
            throw new Exception("You are not assigned to a branch yet");
        }
        Store store = branch.getStore();
        if (store == null) {
            throw new Exception("Your branch is not linked to a store");
        }

        String phone = customerDTO.getPhone() != null ? customerDTO.getPhone().trim() : null;
        if (phone != null && !phone.isEmpty()
                && customerRepository.existsByStoreIdAndPhone(store.getId(), phone)) {
            throw new Exception("A customer with this phone number already exists");
        }

        Customer customer = Customer.builder()
                .fullName(customerDTO.getFullName())
                .email(customerDTO.getEmail())
                .phone(phone)
                .store(store)
                .branch(branch) // permanent "home branch"
                .build();

        Customer saved = customerRepository.save(customer);
        return CustomerMapper.toDTO(saved);
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) throws Exception {
        Customer customerToUpdate = findOwnCustomer(id);

        customerToUpdate.setFullName(customerDTO.getFullName());
        customerToUpdate.setEmail(customerDTO.getEmail());
        customerToUpdate.setPhone(customerDTO.getPhone());

        Customer saved = customerRepository.save(customerToUpdate);
        return CustomerMapper.toDTO(saved);
    }

    @Override
    public void deleteCustomer(Long id) throws Exception {
        Customer customerToDelete = findOwnCustomer(id);
        customerRepository.delete(customerToDelete);
    }

    @Override
    public CustomerDTO getCustomer(Long id) throws Exception {
        return CustomerMapper.toDTO(findOwnCustomer(id));
    }

    @Override
    public List<CustomerDTO> getAllCustomers() throws Exception {
        User user = userService.getCurrentUser();

        if (isBranchLevel(user.getRole())) {
            Branch branch = user.getBranch();
            if (branch == null) {
                throw new Exception("You are not assigned to a branch yet");
            }
            return customerRepository.findByBranchId(branch.getId()).stream()
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());
        }

        if (isStoreLevel(user.getRole())) {
            Store store = currentStore(user);
            return customerRepository.findByStoreId(store.getId()).stream()
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());
        }

        throw new Exception("Your role does not have access to customers");
    }

    @Override
    public List<CustomerDTO> searchCustomers(String keyword) throws Exception {
        User user = userService.getCurrentUser();

        if (isBranchLevel(user.getRole())) {
            Branch branch = user.getBranch();
            if (branch == null) {
                throw new Exception("You are not assigned to a branch yet");
            }
            return customerRepository.searchInBranch(branch.getId(), keyword).stream()
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());
        }

        if (isStoreLevel(user.getRole())) {
            Store store = currentStore(user);
            return customerRepository.searchInStore(store.getId(), null, keyword).stream()
                    .map(CustomerMapper::toDTO)
                    .collect(Collectors.toList());
        }

        throw new Exception("Your role does not have access to customers");
    }
}