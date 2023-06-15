const Token = artifacts.require("MyToken");
const {expectRevert} = require("@openzeppelin/test-helpers")

// Simple ERC20 contract to test and show the current issue 
// with revert in frontier's RPC.
//
// The first 3 tests are to show that the contract is working properly
// And the the last test should help detect the problem.
contract('MyToken', accounts => {
    let token;

    const _totalSupply = "8000000000000000000000000";
    beforeEach(async () => {
        // Deploy token contract
        token = await Token.new(_totalSupply, { from: accounts[0] });

    });
    // Check Total Supply
    it("checks total supply", async () => {
        const totalSupply = await token.totalSupply.call();
        assert.equal(totalSupply, _totalSupply, 'total supply is wrong');

    });

    // Check the balance of the owner of the contract
    it("should return the balance of token owner", async () => {
        const balance = await token.balanceOf.call(accounts[0]);
        assert.equal(balance, _totalSupply, 'balance is wrong');
    });

    // Transfer token and check balances
    it("should transfer token", async () => {
        const amount = "1000000000000000000";
        // Transfer method
        await token.transfer(accounts[1], amount, { from: accounts[0] });
        balance1 = await token.balanceOf.call(accounts[1]);
        assert.equal(balance1, amount, 'accounts[1] balance is wrong');
    });

    // --- Demonstrate the current issue with Frontier ---

    // Make a transfer to address zero which will fail 
    // because of require(from != address(0), "ERC20: transfer from the zero address");
    it("should revert transfer to zero address", async () => {
        let zero_address = "0x0000000000000000000000000000000000000000";
        let expected_revert_reason = 'ERC20: transfer to the zero address';

        console.log("---log the actual result of executing the transaction---")
        try {
            await token.transfer(zero_address, 10)  //will revert
        } catch (tx_err) {
            console.log(tx_err)  //log the error
            //currently the result has "reason: undefined"
        }

        //Now we try again but wrapping it in expectRevert which gives an informative message.
        console.log('\n##### Using expect from openzeppelin/test-helpers #####\n');
        await expectRevert(token.transfer(zero_address, 10), expected_revert_reason);

        // In the terminal we can see that this returns:
        //
        // @openzeppelin/test-helpers WARN expectRevert: Assertions may yield false negatives!
        // Revert reason checks are only known to work on Ganache >=2.2.0 and Hardhat, and the current node is frontier-template/v1.1/fc-rpc-2.0.0-dev.
    })
});
