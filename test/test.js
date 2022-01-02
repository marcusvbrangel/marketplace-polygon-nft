const Market = artifacts.require('./NFTMarket.sol');
const NFT = artifacts.require('./NFT.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

let ethers = require('ethers');
let web3 = require('web3');

contract('Market', (accounts) => {

  contract('NFT', (accounts) => {

    let contractMarket;
    let contractNFT;
    let addressBlanck;

    before(async () => {

      contractMarket = await Market.deployed();

      contractNFT = await NFT.deployed();

      addressBlanck = '0x0';

    });

    describe('deployment', async () => {

      it('Market contract is deployed successfully',async () => {

        const addressMarket = contractMarket.address;

        assert.notEqual(addressMarket, addressBlanck);

      });

      it('NFT contract is deployed successfully', async () => {

        const addressNFT = contractNFT.address;

        assert.notEqual(addressNFT, addressBlanck);

      });


    });

    describe('Creating token', async () => {

      it('NFT contract creates a new token', async () => {

        const tx = await contractNFT.createToken('http://ipfs.imageaddress01', {from: accounts[0]});

        const tokenURI = await contractNFT.tokenURI(1);

        assert.equal(tokenURI, 'http://ipfs.imageaddress01');


        const event = tx.logs[0].args;

        console.log('----------- console test NFT -----------');
        console.log('tokenId', event.tokenId.toNumber());
        console.log('----------------------------------------');

      });

      it('NFTMarket contract creates a new token', async () => {

        let listingPrice = await contractMarket.getListingPrice();

        let auctionPrice = ethers.utils.parseUnits('10', 'ether');

        const tx = await contractMarket.createMarketItem(contractNFT.address, 1, auctionPrice, { value: listingPrice });

        const items = await contractMarket.fetchMarketItems();

        console.log('----------- console test NFTMarket -----------');
        console.log('listingPrice: ', web3.utils.fromWei(listingPrice.toString(), 'ether'));
        console.log('auctionPrice', auctionPrice.toString());
        console.log('items', items);
        console.log('----------------------------------------------');

      });

    });

  });

});
