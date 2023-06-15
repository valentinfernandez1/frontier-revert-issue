## Truffle Revert Reason Issue
This repository aims to address a current issue that exists in Frontier and other EVM-compatible substrate projects.

### Context
When writing Solidity contracts to be deployed on an EVM-compatible network, it is common to include functions with conditions that, when false, revert the execution of the function with a specific message. For example:
```solidity
function foo(){
    require(condition, revert_message);
    ...
}
```
When testing these contracts using Truffle, it is common to write tests that verify if a function reverts properly and returns the expected message. For instance:
```javascript
 it("should revert transfer to zero address", async () =>
    ...
    await expectRevert(contract.foo(), revert_reason);
 }
```
### Problem
While attempting to test previously developed tests for different Solidity smart contracts using Frontier and Truffle, it was discovered that the tests were failing because the `revert_reason` was undefined. The issue may be caused by the Frontier RPC, which does not correctly return this value.

### Recreating the Scenario
Inside this repo there is a very simple implementation to demonstrate the issue and be able to test Frontier and the solutions applied to it.

To recreate this we must deploy a simple contract that can be found in `/contracts/MyToken.sol` in frontier and then run the tests in `test/ERC20_reverts.js`.

First we need the frontier-node-template binary that can be compiled from the [Frontier repo](https://github.com/paritytech/frontier) running:
```bash
cargo build --release
```
The frontier-node-template chain must be running in the background:
```bash
./target/release/frontier-template-node --dev
```
In the root directory of this repository, execute the following commands to run the Truffle tests (Frontier is already configured as the default chain):
```bash
#Install project dependencies
npm i

#Execute truffle tests
./node_modules/.bin/truffle test
```
### Current test results
While the initial tests are intended to verify that the contract functions correctly, our focus will be on the last test, which forces a token transfer to revert. The loggs of the transaction for this tests show:
```bash
{
  name: 'StatusError',
  tx: '0x6e71173ce7a102d0d8a3c43529202b65fab2f7f50346789d6debb3d7b35777d0',
  receipt: {
    ...
  },
  reason: undefined,
  hijackedStack: ''
}
```
As expected, the transaction failed, but the reason for the failure appears to be `undefined`.

The second part of the test attempts the same operation but wraps the execution in an  expectRevert() statement:
```javascript
await expectRevert(token.transfer(zero_address, 10), expected_revert_reason);
```
The message provided by the library in the terminal is as follows:
```bash
@openzeppelin/test-helpers WARN expectRevert: Assertions may yield false negatives!

Revert reason checks are only known to work on Ganache >=2.2.0 and Hardhat, and the current node is frontier-template/v1.1/fc-rpc-2.0.0-dev.
```
### Conclusion
If this issue is addressed, Frontier can provide a more robust and reliable outcome for Solidity tests. This improvement would greatly benefit developers who already have their Smart contract testing projects set up, as they would be able to seamlessly port their tests to Frontier without needing to modify them to suppress the revert_reason.
