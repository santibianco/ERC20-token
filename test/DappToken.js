const MyToken = artifacts.require("MyToken");

contract('MyToken' , (accounts) => {
    var tokenInstance;

    it('initializes the contract with the correct vaulues', () => {
        return MyToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then( (name) => {
            assert.equal(name, 'Santi Token', 'has the correct name');
            return tokenInstance.symbol();
        }).then( (symbol) => {
            assert.equal(symbol, 'S22', 'has the correcct symbol');
            return tokenInstance.standard();
        }).then( (standard) => {
            assert.equal(standard, 'Santi Token v1.0', 'has the correcct standard');
        });
    });

    it('allocates the total supply upon deployment', () => {
        return MyToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then( (totalSupply) => {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1.000.000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then((admingBalance) => {
            assert.equal(admingBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
        });
    })

    it('transfers token ownership', () =>{
        return MyToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999)
        }).then(assert.fail).catch( (error) => {
            assert(error.message.indexOf('revert') >= 0, 'triggers require statement');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then( (success) => {
            assert.equal(success, true, 'returns boolean true value');    
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'the one triggered is the Transfer event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfered amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then((balance) => {
            assert.equal(balance.toNumber(),250000, 'adds the amount to the receiving account'); 
            return tokenInstance.balanceOf(accounts[0]);
        }).then((balance) => {
            assert.equal(balance.toNumber(),750000, 'deducts the amount from the sender account'); 
        });;
    })

    it('approves tokens for delegated transfer', () => {
        return MyToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then( (success) => {
            assert.equal(success, true, "returns true when success");
            return tokenInstance.approve(accounts[1], 100);
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'the one triggered is the Approval event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfered amount');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then( (allowance) => {
            assert.equal(allowance, 100, 'stores the allowance for delegated transfer');
        });
    });

    it('handles delegated transfer', () => {
        return MyToken.deployed().then( (instance) => {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            // Transfer some tokens to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then( (receipt) => {
            // Approve spendingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then( (receipt) =>{
            // Try transfering something larger than the sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 200, {from: spendingAccount});
        }).then(assert.fail).catch( (error) => {
            assert(error.message.indexOf('revert') >= 0, 'triggers revert when transfering value larger than balance ');
            // Try transfering something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch( (error) => {
            assert(error.message.indexOf('revert') >= 0, 'triggers revert when transfering value larger than the approved amount ');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then( (success) => {
            assert.equal(success, true, "returns true when success");
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'the one triggered is the Transfer event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfered amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then( (balance) =>{
            assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then( (balance) =>{
            assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then( (allowance) => {
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
    });

});