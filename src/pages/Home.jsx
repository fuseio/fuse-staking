import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ValidatorsList from '@/components/ValidatorsList'
import Tabs from '@/components/Tabs'
import InfoBox from '@/components/common/InfoBox'
import briefcaseIcon from '@/assets/images/briefcase-check.svg'
import metricIcon from '@/assets/images/metric.svg'
import blockCubeIcon from '@/assets/images/block_cude.svg'
import useInterval from '@/hooks/useInterval'
import { formatWeiToNumber } from '@/utils/format'
import get from 'lodash/get'
import { getBlockNumber } from '@/actions/consensus'

export default ({ handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress, blockNumber = 0 } = useSelector(state => state.network)
  const accounts = useSelector(state => state.accounts)
  const balanceOfNative = get(accounts, [accountAddress, 'balanceOfNative'], 0)

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
            link='https://app.uniswap.org/#/add/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d/ETH'
            name='deposits'
            symbol='FUSE'
            modalText='Your Deposits - Your deposits shows the total amount of FUSE you have deposited into the Staking Contract.'
            title='Balance'
            end={formatWeiToNumber(balanceOfNative)}
            Icon={() => (
              <img src={briefcaseIcon} />
            )}
          />
          <InfoBox
            link='https://etherscan.io/token/0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d'
            name='rewards'
            symbol='FUSE'
            modalText={"Accrued Rewards - Accrued Rewards refers to the total FUSE you've earned for your stake"}
            end={0}
            title='Accrued rewards'
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
