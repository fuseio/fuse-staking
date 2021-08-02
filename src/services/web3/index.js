import Web3 from 'web3'

let givenWeb3

export const getWeb3 = ({ provider, networkType } = {}) => {
  if (networkType) {
    return web3ByNetworkType[networkType]
  }

  if (provider) {
    givenWeb3 = null
    givenWeb3 = new Web3(provider)
    return givenWeb3
  }

  if (givenWeb3) return givenWeb3
}

export const fuse = new Web3(CONFIG.web3.fuseProvider)

const web3ByNetworkType = {
  fuse
}

export default givenWeb3
