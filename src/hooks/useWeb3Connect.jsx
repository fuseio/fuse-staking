import { useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@fuseio/walletconnect-web3-provider'
import WalletLink from 'walletlink'

const providerOptions = {
  metamask: {},
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://walletconnect-bridge.fuse.io',
      rpc: {
        122: 'https://rpc.fuse.io'
      }
    }
  },
  'custom-coinbase': {
    display: {
      logo:
        'https://raw.githubusercontent.com/walletlink/walletlink/master/web/src/images/wallets/coinbase-wallet.svg',
      name: 'Coinbase Wallet',
      description: 'Scan with Coinbase Wallet to connect'
    },
    options: {
      appName: 'Fuse Staking',
      networkUrl: 'https://rpc.fuse.io',
      chainId: 122
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
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
