const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");
const Kyber = require('./contracts/KyberProxy.js');
const fs = require('fs');
const bn = require('bignumber.js');
bn.config({ EXPONENTIAL_AT: 80 });

const DECIMALS = bn(10**18);

/******TOKEN ADDRESSES********/
const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const DAI_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
const DGX_ADDRESS = '0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf';
const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

/**********WALLETS************/
const FOUNDATION_ADDRESS = '0xd9d2B28E09921A38aD7aB1B4138357408bda8EBD';
const DDF_ADDRESS = '0xFd1E4b568Bb3bcF706b0bac5960d4B91BacFF96F';

/*****SET TRADE VALUES********/
let FROM_ADDRESS = ETH_ADDRESS;
let TO_ADDRESS = DAI_ADDRESS;
let WALLET_ADDRESS = FOUNDATION_ADDRESS;
let FROM_AMOUNT = bn(10).times(DECIMALS).toString(); //10 ETH
let FROM_VALUE;
if (FROM_ADDRESS == ETH_ADDRESS){
  FROM_VALUE = FROM_AMOUNT;
} else {
  FROM_VALUE = 0;
}
let MAX_DEST_AMOUNT = bn(2**255).toString();
let WALLET_ID = 0;
let MIN_RATE = 0; //This is calculate by getting slippage from expectedRate()
/*****************************/

let mnemonic, infura_key;
if(fs.existsSync('keys.json')){
  var json = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
  mnemonic = json.mnemonic;
  infura_key = json.infura;
}

const provider = new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infura_key}`);
const web3 = new Web3(provider);

const kyberContract = new web3.eth.Contract(
  Kyber.ABI,
  Kyber.ADDRESS,
);

(async function() {
  //Get account
  const accounts = await web3.eth.getAccounts();
  console.log('Accounts: ', accounts);

  let rates = await kyberContract.methods.getExpectedRate(FROM_ADDRESS, TO_ADDRESS, FROM_AMOUNT).call({from:accounts[0]});
  MIN_RATE = rates[1];
  console.log('Min Rate: ', MIN_RATE);

  var data = await kyberContract.methods
    .trade(FROM_ADDRESS, FROM_AMOUNT, TO_ADDRESS, WALLET_ADDRESS, MAX_DEST_AMOUNT, MIN_RATE, WALLET_ID)
    .encodeABI({
      from: accounts[0]
    });

  console.log('Data:');
  console.log(data);
  process.exit();
})();
