import React from 'react'
import { formatWei } from '@/utils/format'

function StakeAmountCell ({ row: { original: { yourStake, stakeAmount } } }) {
  return (
    <div className='staked'>{yourStake && yourStake !== '0' ? `${formatWei(yourStake)} / ` : ''} {!Number(stakeAmount) ? '0' : formatWei(stakeAmount)}</div>
  )
}

export default StakeAmountCell
