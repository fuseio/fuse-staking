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
    rpc: 'https://rpc.fuse.io',
    explorer: 'https://explorer.fuse.io'
  }
}

export const getNetwork = (networkId) => networks[networkId]
