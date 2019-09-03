pragma solidity >=0.5.0 <0.6.0;

import "./MyToken.sol";

contract TokenSale {

  using SafeMath for uint256;

  address payable owner;
  MyToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokensSold;

  event Sell(
    address indexed _buyer,
    uint256 _amount
  );

  constructor(MyToken _tokenContract, uint256 _tokenPrice) public {
    owner = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    require(msg.value == _numberOfTokens.mul(tokenPrice), 'check value sent');
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'not enough tokens for that purchase');
    require(tokenContract.transfer(msg.sender, _numberOfTokens), 'transfer failed');
    tokensSold = tokensSold.add(_numberOfTokens);
    emit Sell(msg.sender, _numberOfTokens);
  }

  function endSale() public {
    require(msg.sender == owner, 'Only owner can end the sale');
    require(tokenContract.transfer(owner, tokenContract.balanceOf(address(this))), 'transfer failed');
    owner.transfer(address(this).balance);
  }

}
