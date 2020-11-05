import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

const GrayContainer = ({ title, val, end, modifier, symbol }) => {
  const { accountAddress } = useSelector(state => state.network)
  const { countUp, start, update } = useCountUp({
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
          + {val}%
        </div>
      </div>
      <div className='grid-x align-justify align-middle'>
        <div className={classNames('value', { 'value--disabled': !accountAddress })}>{countUp} {symbol}</div>
      </div>
    </div>
  )
}

export default GrayContainer
