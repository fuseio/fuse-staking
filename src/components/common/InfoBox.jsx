import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

export default ({ Icon, name, title, end, withSymbol = true, symbol }) => {
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
    <div className={classNames('info_box', { [`info_box--${name}`]: name && accountAddress }, { 'info_box--disabled': !accountAddress })}>
      <div className='icons'>
        <Icon />
      </div>
      <div>
        {
          withSymbol
            ? (
              <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>
                {countUp}&nbsp;
                {symbol}
              </div>
            )
            : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>{countUp}</div>
        }
        <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{title}</div>
      </div>
    </div>
  )
}
