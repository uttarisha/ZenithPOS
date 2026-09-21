package com.usshh.service;

import com.usshh.exceptions.UserException;
import com.usshh.model.User;
import com.usshh.payload.dto.BranchDTO;

import java.util.List;

public interface BranchService {

    BranchDTO createBranch(BranchDTO branchDTO) throws UserException;
    BranchDTO updateBranch(Long id, BranchDTO branchDTO) throws Exception;
    void deleteBranch(Long id) throws Exception;
    void forceDeleteBranch(Long id) throws Exception;
    List<BranchDTO> getAllBranchesByStoreId(Long storeId);
    BranchDTO getBranchById(Long id) throws Exception;
}