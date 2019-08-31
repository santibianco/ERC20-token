const TokenSale = artifacts.require("TokenSale");

contract('TokenSale', function(accounts) {
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000; //wei

  it("initializes the contract with the correct values", () => {
    return TokenSale.deployed().then( (instance) => {
      tokenSaleInstance = instance;
      return tokenSaleInstance.address;
    }).then( (address) => {
      assert.notEqual(address, 0, "sets contract address");
      return tokenSaleInstance.tokenContract();
    }).then( (address) => {
      assert.notEqual(address, 0, "sets a token contract address");
      return tokenSaleInstance.tokenPrice();
    }).then( (price) => {
      assert.equal(price, tokenPrice, "sets the token price correctly");
    });
  });
});
