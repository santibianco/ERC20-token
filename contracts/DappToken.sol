pragma solidity >=0.4.21 <0.6.0;

contract DappToken {
    string public name = 'Santi Token';
    string public symbol = 'S22';
    string public standard = 'Santi Token v1.0';
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }


}