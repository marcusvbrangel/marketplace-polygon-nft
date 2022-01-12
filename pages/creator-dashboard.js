/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftaddress, nftmarketaddress } from '../config.js'

import NFT from '../build/contracts/NFT.json'
import NFTMarket from '../build/contracts/NFTMarket.json'

export default function CreatorDashboard() {

  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {

    loadNFTs()

  }, [])

  const loadNFTs = async () => {

    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

    const data = await marketContract.fetchItemsCreated()

    const items = await Promise.all(data.map(async (i) => {

      const tokenUri = await tokenContract.tokenURI(i.tokenId)

      const meta = await axios.get(tokenUri)

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

      let item = {
        price,
        tokenId: i.tokenId,
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }

      return item

    }))

    const soldItems = items.filter((i) => i.sold)

    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')

  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)

  return (

    <div>
    
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} MATIC</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-2xl py-2">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
        </div>
        
    </div>

  )

}
