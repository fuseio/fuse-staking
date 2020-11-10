import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import get from 'lodash/get'
import ReactModal from 'react-modal'
import { useModal } from 'react-modal-hook'
import ValidatorsList from '@/components/ValidatorsList'
import Tabs from '@/components/Tabs'
import InfoBox from '@/components/common/InfoBox'
import LargeInfoBox from '@/components/common/LargeInfoBox'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import SwitchToFuse from '@/assets/images/step_1.png'
import SwitchToFuseGuide from '@/assets/images/step_2.png'
import metricIcon from '@/assets/images/metric.svg'
import blockCubeIcon from '@/assets/images/block_cude.svg'
import useInterval from '@/hooks/useInterval'
import { formatWeiToNumber } from '@/utils/format'
import BigNumber from 'bignumber.js'
import { balanceOfNative } from '@/actions/accounts'
import { getValidators, getTotalStakeAmount, getBlockRewardAmount, getBlockNumber } from '@/actions/consensus'

export default ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress, blockNumber = 0, networkId } = useSelector(state => state.network)
  const { totalStakeAmount } = useSelector(state => state.consensus)
  const accounts = useSelector(state => state.accounts)
  const balance = get(accounts, [accountAddress, 'balanceOfNative'], 0)
  const validators = useSelector(state => state.entities.validators)

  const myTotal = useMemo(() => Object.values(validators).reduce((accumulator, { yourStake }) => accumulator.plus(new BigNumber(yourStake)), new BigNumber(0)), [validators])

  const [modalStatus, setModalStatus] = useState(false)
  const [secondModalStatus, setSecondModalStatus] = useState(false)

  useEffect(() => {
    dispatch(getValidators(true))
  }, [])

  const [showSecondModal] = useModal(() => (
    <ReactModal isOpen={secondModalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='title'>
          Add Fuse network to Metamask
        </div>
        <div>
          <img src={SwitchToFuseGuide} />
        </div>
        <div className='text grid-y'>
          <div className='grid-x cell align-middle shrink'>
            <strong>Network name: </strong>
            &nbsp;Fuse network
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>RPC Url: </strong>
            &nbsp;https://rpc.fuse.io
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>ChainID: </strong>
            &nbsp;0x7a
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>Symbol: </strong>
            &nbsp;FUSE
          </div>
          <div className='grid-x cell align-middle shrink'>
            <strong>Explorer: </strong>
            &nbsp;https://explorer.fuse.io
          </div>
        </div>
        <button
          className='close'
          onClick={() => {
            setSecondModalStatus(false)
          }}
        >
          Close
        </button>
      </div>
    </ReactModal>
  ), [modalStatus])

  const [showModal] = useModal(() => (
    <ReactModal isOpen={modalStatus} overlayClassName='modal__overlay' className='modal__content'>
      <div className='info-modal'>
        <div className='title'>
          Connect to FUSE network
        </div>
        <div>
          <img src={SwitchToFuse} />
        </div>
        <div className='text'>
          Click
          <strong
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setModalStatus(false)
              showSecondModal()
              setSecondModalStatus(true)
            }}
          >
            {' here '}
          </strong>
            to learn how to add Fuse network to Metamask
        </div>
        <button
          className='close'
          onClick={() => {
            setModalStatus(false)
          }}
        >
          Close
        </button>
      </div>
    </ReactModal>
  ), [modalStatus])

  useEffect(() => {
    dispatch(balanceOfNative(accountAddress))
  }, [accountAddress])

  useEffect(() => {
    if (networkId) {
      if (accountAddress) {
        dispatch(balanceOfNative(accountAddress))
      }
      dispatch(getTotalStakeAmount())
      dispatch(getBlockRewardAmount())
      dispatch(getBlockNumber())
      if (networkId !== 122) {
        showModal()
        setModalStatus(true)
      }
      if (networkId === 122) {
        setModalStatus(false)
      }
    }
  }, [networkId])

  useInterval(() => {
    dispatch(getBlockNumber())
  }, 10000)

  return (
    <div className='main'>
      <div className='main__content'>
        <div className='boxs'>
          <InfoBox
            name='apy'
            modalText='APY - Annual Percentage Yield (APY) is the estimated yearly yield for tokens locked. Our calculation is " $ locked * (1 year in second)/(total stake in $ * time remaining in seconds).'
            withSymbol={false}
            end={blockNumber}
            title='Block number'
            Icon={() => (
              <img src={blockCubeIcon} />
            )}
          />
          <InfoBox
            name='deposits'
            symbol='FUSE'
            title='Balance'
            end={formatWeiToNumber(balance)}
            Icon={() => (
              <img src={briefcaseIcon} />
            )}
          />
          <LargeInfoBox
            name='rewards'
            symbol='FUSE'
            end={isNaN(formatWeiToNumber(myTotal)) ? 0 : formatWeiToNumber(myTotal)}
            secondEnd={isNaN(formatWeiToNumber(totalStakeAmount)) ? 0 : formatWeiToNumber(totalStakeAmount)}
            title='Your total staked'
            secondTitle='Total staked'
            Icon={() => (
              <img src={metricIcon} />
            )}
          />
        </div>
        <ValidatorsList />
      </div>
      <Tabs handleConnect={handleConnect} />
    </div>
  )
}
