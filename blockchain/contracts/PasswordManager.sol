// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

contract PasswordManager {
    struct PasswordEntry {
        string service;
        string encryptedPassword;
        uint256 timestamp;
    }
    
    mapping(address => PasswordEntry[]) private userPasswords;
    
    event PasswordAdded(address indexed user, string service, uint256 timestamp);
    event PasswordDeleted(address indexed user, uint256 index);
    
    function addPassword(string memory service, string memory encryptedPassword) public {
        userPasswords[msg.sender].push(PasswordEntry({
            service: service,
            encryptedPassword: encryptedPassword,
            timestamp: block.timestamp
        }));
        
        emit PasswordAdded(msg.sender, service, block.timestamp);
    }
    
    function getPasswordCount() public view returns (uint256) {
        return userPasswords[msg.sender].length;
    }
    
    function getPassword(uint256 index) public view returns (string memory, string memory, uint256) {
        require(index < userPasswords[msg.sender].length, "Index out of bounds");
        PasswordEntry memory entry = userPasswords[msg.sender][index];
        return (entry.service, entry.encryptedPassword, entry.timestamp);
    }
    
    function getAllPasswords() public view returns (PasswordEntry[] memory) {
        return userPasswords[msg.sender];
    }
    
    function deletePassword(uint256 index) public {
        require(index < userPasswords[msg.sender].length, "Index out of bounds");
        
        uint256 lastIndex = userPasswords[msg.sender].length - 1;
        if (index != lastIndex) {
            userPasswords[msg.sender][index] = userPasswords[msg.sender][lastIndex];
        }
        userPasswords[msg.sender].pop();
        
        emit PasswordDeleted(msg.sender, index);
    }
}
