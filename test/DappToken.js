const DappToken = artifacts.require("DappToken");

contract('DappToken' , (accounts) => {
    var tokenInstance;

    it('sets the total supply amount upon deployment', () => {
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