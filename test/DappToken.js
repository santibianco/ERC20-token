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
});