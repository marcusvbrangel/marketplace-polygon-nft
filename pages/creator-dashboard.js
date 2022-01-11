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

  useEffect(() => {

    loadNFTs()

  }, [])

  const loadNFTs = async () => {

  }

  return (

    <div><h1>Creator Dashboard</h1></div>

  )

}



