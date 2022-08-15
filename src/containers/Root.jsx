import ReactGA from 'react-ga4'
import React, { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Header from '@/components/common/Header.jsx'
import GoogleAnalyticsReporter from '@/components/analytics'
import Footer from '@/components/common/Footer.jsx'
import HomePage from '@/pages/Home'
import { getWeb3 } from '@/services/web3'
import useWeb3Connect from '@/hooks/useWeb3Connect'
import { connectToWallet, disconnectWallet } from '@/actions/network'

export default () => {
  const dispatch = useDispatch()
  const onConnectCallback = (provider) => {
    getWeb3({ provider })
    dispatch(connectToWallet())
  }

  const web3connect = useWeb3Connect(onConnectCallback)

  const handleLogout = useCallback(async () => {
    try {
      if (web3connect?.provider?.close) {
        await web3connect?.provider?.close()
      }

      await web3connect?.core?.clearCachedProvider()
      dispatch(disconnectWallet())
    } catch (e) {
      console.error(e)
    }
  }, [web3connect])

  const handleConnect = useCallback(() => {
    web3connect.toggleModal()
    ReactGA.event({
      category: 'action',
      action: 'Connect wallet',
      label: 'Connect wallet'
    })
  }, [web3connect])

  useEffect(() => {
    if (web3connect.core.cachedProvider) {
      web3connect.core.connect()
    }
  }, [])

  return (
    <>
      <Header handleConnect={handleConnect} handleLogout={handleLogout} />
      <HomePage handleConnect={handleConnect} />
      <Footer />
    </>
  )
}
