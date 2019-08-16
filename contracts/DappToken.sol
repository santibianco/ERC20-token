pragma solidity >=0.4.21 <0.6.0;

contract DappToken {
    // Set the total number of tokens
    // Read the total number of tokens
    uint256 public totalSupply;

    // Constructor
    constructor() public{
        totalSupply = 1000000;
    }
}