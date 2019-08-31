const MyToken = artifacts.require("MyToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = function(deployer) {
  deployer.deploy(MyToken, 1000000).then( () =>{
    const tokenPrice = 1000000000000000; //wei
    return deployer.deploy(TokenSale, MyToken.address, tokenPrice);
  });
  
};
