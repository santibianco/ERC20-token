pragma solidity >=0.4.21 <0.6.0;

contract MyToken {
    string public name = 'Santi Token';
    string public symbol = 'S22';
    string public standard = 'Santi Token v1.0';
    uint256 public totalSupply;

    // balance function implemented as a public mapping
    mapping(address => uint256) public balanceOf;

    // allowance function implemented as a public nested mapping
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value, 'Not enough tokens');
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

}