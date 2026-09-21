package com.usshh.mapper;

import com.usshh.model.User;
import com.usshh.payload.dto.UserDTO;

public class UserMapper {

    public static UserDTO toDTO(User savedUser) {
        UserDTO userDto = new UserDTO();
        userDto.setId(savedUser.getId());
        userDto.setFullName(savedUser.getFullName());
        userDto.setEmail(savedUser.getEmail());
        userDto.setRole(savedUser.getRole());
        userDto.setCreatedAt(savedUser.getCreatedAt());
        userDto.setUpdatedAt(savedUser.getUpdatedAt());
        userDto.setLastLogin(savedUser.getLastLogin());
        userDto.setPhone(savedUser.getPhone());
        userDto.setStoreId(savedUser.getStore()!=null ?savedUser.getStore().getId():null);
        userDto.setBranchId(savedUser.getBranch()!=null ?savedUser.getBranch().getId():null);


        return userDto;
    }

    public static User toEntity(UserDTO userDto) {
        User createdUser = new User();
        // createdUser.setId(userDto.getId());
        createdUser.setEmail(userDto.getEmail());
        createdUser.setFullName(userDto.getFullName());
        createdUser.setRole(userDto.getRole());
        createdUser.setCreatedAt(userDto.getCreatedAt());
        createdUser.setUpdatedAt(userDto.getUpdatedAt());
        createdUser.setLastLogin(userDto.getLastLogin());
        createdUser.setPhone(userDto.getPhone());
        createdUser.setPassword(userDto.getPassword());

        return createdUser;
    }

}
