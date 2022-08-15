import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { useCountUp } from 'react-countup'
import { formatNumber } from '@/utils/format'

export default ({ Icon, name, title, end, secondEnd, withSymbol = true, symbol, secondTitle, decimals }) => {
  const { accountAddress } = useSelector(state => state.network)
  const { start, update } = useCountUp({
    ref: title.split(' ').join(''),
    formattingFn: formatNumber,
    end,
    decimals
  })

  const secondCounter = useCountUp({
    ref: secondTitle.split(' ').join(''),
    formattingFn: formatNumber,
    end
  })

  useEffect(() => {
    start()
    secondCounter.start()
  }, [])

  useEffect(() => {
    update(end)
  }, [end])

  useEffect(() => {
    secondCounter.update(secondEnd)
  }, [secondEnd])

  return (
    <div className={classNames('info_box info_box--large', { [`info_box--${name}`]: name && accountAddress }, { 'info_box--disabled': !accountAddress })}>
      <div className='icons'>
        <Icon />
      </div>
      <div className='grid-x align-middle align-justify content'>
        <div className='cell small-11 grid-y align-justify'>
          {
            withSymbol
              ? (
                <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>
                  <span id={title.split(' ').join('')} />&nbsp;
                  {symbol}
                </div>
                )
              : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })} id={title.split(' ').join('')} />
          }
          <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{title}</div>
        </div>
        <div className='line' />
        <div className='cell small-11 grid-y align-justify'>
          {
            withSymbol
              ? (
                <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })}>
                  <span id={secondTitle.split(' ').join('')} />&nbsp;
                    {symbol}
                  </div>
                )
              : <div className={classNames('info_box__value', { 'info_box__value--disabled': !accountAddress })} id={secondTitle.split(' ').join('')} />
          }
          <div className={classNames('info_box__title', { 'info_box__title--disabled': !accountAddress })}>{secondTitle}</div>
        </div>
      </div>
    </div>
  )
}
