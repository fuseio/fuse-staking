import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

export default ({ Icon, name, title, end, withSymbol = true, symbol, decimals }) => {
  const { accountAddress } = useSelector(state => state.network)
  const { start, update } = useCountUp({
    ref: name.split(' ').join(''),
    formattingFn: formatNumber,
    end,
    decimals
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
      <div className='grid-x align-middle align-justify content'>
        <div className='cell large-auto grid-y align-justify'>
          {
            withSymbol
              ? (
                <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>
                  <span id={name.split(' ').join('')} />&nbsp;
                  {symbol}
                </div>
                )
              : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })} id={name.split(' ').join('')} />
          }
          <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{title}</div>
        </div>
      </div>
    </div>
  )
}
