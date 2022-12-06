import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

const GrayContainer = ({ title, estimatedAPR, end, modifier, symbol }) => {
  const { accountAddress } = useSelector(state => state.network)
  const { start, update } = useCountUp({
    ref: 'counter',
    formattingFn: formatNumber,
    end
  })

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    update(end)
  }, [end])

  return (
    <div className={classNames('gray_container', { [modifier]: modifier })}>
      <div className='grid-x align-justify align-middle'>
        <div className='title'>{title}</div>
        <div className='apy'>
          + {estimatedAPR}%
        </div>
      </div>
      <div className='grid-x align-justify align-middle'>
      <div className={classNames('value', { 'value--disabled': !accountAddress })}>
        <span id='counter' />&nbsp;
        {symbol}
        </div>
      </div>
    </div>
  )
}

export default GrayContainer
