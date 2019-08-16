const DappToken = artifacts.require("DappToken");

contract('DappToken' , (accounts) => {
    
    it('sets the total supply amount upon deployment', () => {
        return DappToken.deployed().then( (instance) => {
            return instance.totalSupply();
        }).then( (totalSupply) => {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1.000.000');
        })
    })

});