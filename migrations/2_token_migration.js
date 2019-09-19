const MyToken = artifacts.require("MyToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(MyToken, 1000000);
  tokenInstance = await MyToken.deployed();
  const tokenPrice = 1000000000000000; //wei
  await deployer.deploy(TokenSale, MyToken.address, tokenPrice);
  tokenInstance.transfer(TokenSale.address, 750000, {from: accounts[0]})
};