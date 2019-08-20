const DappToken = artifacts.require("DappToken");

contract('DappToken' , (accounts) => {
    var tokenInstance;

    it('initializes the contract with the correct vaulues', () => {
        return DappToken.deployed().then( (instance) => {
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
        return DappToken.deployed().then( (instance) => {
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
        return DappToken.deployed().then( (instance) => {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999)
        }).then(assert.fail).catch( (error) => {
            assert(error.message.indexOf('revert') >= 0, 'triggered require statement');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then( (success) => {
            assert.equal(success, true, 'returns boolean true value');    
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'the one triggered is the Transfer event')
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from')
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to')
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfered amount')
            return tokenInstance.balanceOf(accounts[1]);
        }).then((balance) => {
            assert.equal(balance.toNumber(),250000, 'adds the amount to the receiving account'); 
            return tokenInstance.balanceOf(accounts[0]);
        }).then((balance) => {
            assert.equal(balance.toNumber(),750000, 'deducts the amount from the sender account'); 
        });;
    })





});