/* eslint-disable @next/next/no-img-element */
import { ethers } from 'ethers'
import Web3 from 'web3'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config.js'

import NFT from '../build/contracts/NFT.json'
import NFTMarket from '../build/contracts/NFTMarket.json'

export default function Home() {
 
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {

    loadNFTs()

  }, [])

  async function loadNFTs() {

    const web3 = new Web3(window.ethereum)
    const appaccounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()

    const nftData = NFT.networks[networkId]
    const marketData = NFTMarket.networks[networkId]

    if (nftData && marketData) {

      let abi
      let address

      abi = NFT.abi
      address = nftData.address
      const tokenContract = new web3.eth.Contract(abi, address)

      abi = NFTMarket.abi
      address = marketData.address
      const marketContract = new web3.eth.Contract(abi, address)

      const data = await marketContract.methods.fetchMarketItems().call()


      const items = await Promise.all(data.map(async (i) => {

        const tokenUri = await tokenContract.methods.tokenUri(i.tokenId).call()
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        
        let item = {

          price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }

        return item

      }))

      setNfts(items)
      setLoadingState('loaded')

    } else {

      window.alert('smart contracts not deployed on selected network')

    }

  }

  console.log('loadingState', loadingState)
  console.log('nfts', nfts)

  //if (loadingState === 'loaded' && !nfts.length)
    //return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)

  return (

    <div className="flex justify-center">

      <div className="px-4" style={{ maxWidth: '1600px' }}>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

          {
            nfts.map((nft, i) => (

              <div key={i} className="border shadow rounded-xl overflow-hidden">

                <img src={nft.image} alt={nft.name} />

                <div className="p-4">

                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>

                  <div style={{ height: '70px', overflow: 'hidden' }}>

                    <p className="text-gray-400">{nft.description}</p>

                  </div>

                </div>

                <div className="p-4 bg-black">

                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} MATIC</p>

                  <button className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>

                </div>
                
              </div>

            ))

          }

        </div>

      </div>

    </div>

  )


}
