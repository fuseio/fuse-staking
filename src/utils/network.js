export const networkIds = {
  FUSE: 122
}

const networks = {
  [networkIds.FUSE]: {
    chainId: '0x7a',
    chainName: 'Fuse Network',
    nativeCurrency: {
      name: 'Fuse',
      symbol: 'FUSE',
      decimals: 18
    },
    rpc: 'https://nd-942-551-550.p2pify.com/29d9adc81d097da8de657a5c8c773586',
    explorer: 'https://explorer.fuse.io'
  }
}

export const getNetwork = (networkId) => networks[networkId]
