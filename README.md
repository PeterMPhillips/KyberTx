# KyberTx
Get transaction data for a Kyber trade to use in a MultiSigWallet

- Create a json file with a mnemonic phrase and infura key with the following format:
```
{
  "mnemonic" : "blah blah blah",
  "infura" : "tH1Si5n0T4R34lk3Y"
}
```
- Install packages : `npm i`

- Make changes to getTransactionData.js:
```
FROM_ADDRESS: The address of the ERC20 you are converting from
TO_ADDRESS: The address of the ERC20 you are converting to
WALLET_ADDRESS: The address that will receive the converted tokens
FROM_AMOUNT: The amount you want to convert
```
- Once you set your values, just run `node getTransactionData.js`
