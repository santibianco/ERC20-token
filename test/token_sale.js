const TokenSale = artifacts.require("TokenSale");
const MyToken = artifacts.require("MyToken");


contract('TokenSale', function(accounts) {
  let tokenSaleInstance;
  let tokenInstance;
  const buyer = accounts[1];
  const owner = accounts[0]
  const tokensAvailable = 750000;
  const tokenPrice = 1000000000000000; //wei
  const numberOfTokens = 10;

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

  it('facilitates token buying', () => {
    return MyToken.deployed().then( (instance) => {
      tokenInstance = instance;
      return TokenSale.deployed();
    }).then( (instance) => {
      tokenSaleInstance = instance;
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: owner});
    }).then( (recepit) => {  
      return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens * tokenPrice})  
    }).then( (receipt) => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'the one triggered is the Transfer event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer account');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then( (amount) => {
      assert.equal(amount.toNumber(), numberOfTokens, "increments the number of tokens sold");
      return tokenInstance.balanceOf(buyer);
    }).then((balance) => {
      assert.equal(balance.toNumber(), numberOfTokens, "increases the buyer balance after the purchase");
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then((balance) => {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, "decreases the token sale contract balance after the purchase");
      return tokenSaleInstance.buyTokens.call(numberOfTokens, {from: buyer, value: 1});
    }).then(assert.fail).catch( (error) => {
      assert(error.message.indexOf('revert') >= 0, 'avoids sending incorrect value');
      return tokenSaleInstance.buyTokens.call(tokensAvailable + 1, {from: buyer, value: numberOfTokens * tokenPrice});
    }).then(assert.fail).catch( (error) => {
      assert(error.message.indexOf('revert') >= 0, 'avoids buying more tokens than available');
    });
  });

  it('ends token sale', function() {
    return MyToken.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return TokenSale.deployed();
    }).then( (instance) => {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Try to end sale from account other than the owner
      return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch( (error) => {
      assert(error.message.indexOf('revert' >= 0, 'avoids ending sale without being the owner'));
      // End sale as owner
      return tokenSaleInstance.endSale({ from: owner });
    }).then( () => {
      return tokenInstance.balanceOf(owner);
    }).then( (balance) => {
      assert.equal(balance, 999990, 'returns all unsold dapp tokens to owner');
      // Check that the contract has no balance
      return web3.eth.getBalance(tokenSaleInstance.address);
    }).then( (balance) => {
      assert.equal(balance, 0, 'extracts remaining ether from contract');
    });
  });

});
