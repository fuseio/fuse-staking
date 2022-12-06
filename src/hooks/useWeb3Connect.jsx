import { useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@fuseio/walletconnect-web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'

const providerOptions = {
  metamask: {},
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://walletconnect.fuse.io',
      rpc: {
        122: CONFIG.web3.fuseProvider
      }
    }
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Fuse Staking",
      rpc: CONFIG.web3.fuseProvider,
      chainId: 1,
    }
  }
}

const useWeb3Connect = (connectCallback) => {
  const [provider, setProvider] = useState()

  const web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: true
  })

  web3Modal.on('connect', (provider) => {
    setProvider(provider)
    connectCallback(provider)
  })

  web3Modal.on('disconnected', () => {
    setProvider(null)
  })

  const toggleModal = () => {
    web3Modal.toggleModal()
  }

  return { provider, toggleModal, core: web3Modal }
}

export default useWeb3Connect
