/* eslint import/extensions: 0 */
import chai from 'chai';
import fetch from 'node-fetch';
import hardhat from 'hardhat';
import elasticSwapSDK from '../../dist/index.js';

const { ethers, deployments } = hardhat;
const { assert } = chai;

describe('ERC20', () => {
  let sdk;

  before(async () => {
    const env = {
      networkId: 99999,
      exchangeFactoryAddress: '0x8C2251e028043e38f58Ac64c00E1F940D305Aa62'
    };
    sdk = new elasticSwapSDK.SDK({ env, customFetch: fetch, provider: hardhat.ethers.provider });
  });

  describe('getBalances', () => {
    it('can be created via constructor', async () => {
      const accounts = await ethers.getSigners();
      await deployments.fixture();
      
      const QuoteToken = await deployments.get('QuoteToken');
      
      //const quoteToken = new elasticSwapSDK.ERC20(sdk, QuoteToken.address);
      
      const quoteTokenEthersContract = new ethers.Contract(
        QuoteToken.address,
        QuoteToken.abi,
        accounts[0],  // also the admin account / signer, could be imported via getNamedAccounts.
      );

      const accountBalance = await quoteTokenEthersContract.balanceOf(accounts[0].address);
      console.log("account Balance of admin", accountBalance.toString());

      const accountBalance1 = await quoteTokenEthersContract.balanceOf(accounts[1].address);
      console.log("account Balance of 1", accountBalance1.toString());


      await quoteTokenEthersContract.transfer(accounts[1].address, 10000);


      const accountBalance2 = await quoteTokenEthersContract.balanceOf(accounts[0].address);
      console.log("account Balance of admin after transfer", accountBalance2.toString());

      const accountBalance3 = await quoteTokenEthersContract.balanceOf(accounts[1].address);
      console.log("account Balance of 1 after transfer", accountBalance3.toString());

    });
  });
});
