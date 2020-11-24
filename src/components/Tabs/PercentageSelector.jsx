import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { formatWeiToNumber } from '@/utils/format'
import { Field, useFormikContext } from 'formik'

const percentValues = [25, 50, 75, 100]

const calculate = (value, total) => (value / 100) * total

const PercentOption = ({ value, balance }) => {
  const { accountAddress } = useSelector(state => state.network)
  const { validator } = useSelector(state => state.screens.stake)
  const { values: { submitType } } = useFormikContext()
  const percent = submitType === 'stake' && value === 100 ? 99.5 : value
  return (
    <label className={classNames('percent_option', { 'percent_option--disabled': !accountAddress || !validator })}>
      <Field>
        {({ field, form: { setFieldValue } }) => (
          <>
            <input
              {...field}
              type='radio'
              disabled={!accountAddress || !validator}
              onChange={(e) => {
                field.onChange(e)
                setFieldValue('amount', calculate(percent, formatWeiToNumber(balance)))
              }}
              name='percent'
              value={value}
            />
            <span className={classNames('text', { 'text--disabled': !accountAddress || !validator })}>{value} %</span>
          </>
        )}
      </Field>
    </label>
  )
}

const PercentageSelector = ({ balance }) => {
  return (
    <div className='percent_wrapper grid-x align-middle align-justify'>
      {percentValues.map((value) => <PercentOption key={value} value={value} balance={balance} />)}
    </div>
  )
}

export default PercentageSelector
