## Truffle Revert Reason Issue
This repo aims to recreate a current issue that seems to be present in Frontier and other EVM compatible substrate projects. 

### Context
When writing Solidity contracts to be deployed on an EVM compatible network is common to write functions to be executed which include:
```solidity
function foo(){
    require(condition, revert_message);
    ...
}
```
Where a condition can be specified and if this condition is false the execution will be reverted with a `revert_message` that help to detect what is the reason for the reversion of the function execution.

While testing this contracts in Truffle is common to write tests that verify if a function reverts properly and returns the proper message.
```javascript
 it("should revert transfer to zero address", async () =>
    ...
    await expectRevert(contract.foo(), revert_reason);
 }
```
### Problem
While trying to test previosly developed tests for different Solidity Smart Contracts using frontier and truffle I realized that the tests where failing because the revert_reason was `undefined`. The problem might come from the Frontier RPC that is not properly returning this value.

### How to recreate this scenario
Inside this repo there is a very simple implementation to demonstrate the issue and be able to test Frontier and the solutions applied to it.

To recreate this we must deploy a simple contract that can be found in `/contracts/MyToken.sol`

First we need the frontier-node-template binary that can be compiled from the Frontier repo (add link to frontier) running
```bash
cargo build --release
```
The frontier-node-template chain must be running in the background
```bash
./target/release/frontier-template-node --dev
```
Now inside the root of this repository we can execute the next commands to run the tests in Truffle (Frontier is already configured as the default chain):
```bash
npm i
.
