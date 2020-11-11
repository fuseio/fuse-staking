import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { object, number, mixed, string } from 'yup'
import { Formik, Field, Form } from 'formik'
import { withdraw, delegate } from '@/actions/consensus'
import classNames from 'classnames'
import GrayContainer from '@/components/common/GrayContainer.jsx'
import PercentageSelector from './PercentageSelector'
import get from 'lodash/get'
import capitalize from 'lodash/capitalize'
import { toWei, formatWei, formatWeiToNumber } from '@/utils/format'
import walletIcon from '@/assets/images/wallet.svg'
import FuseLoader from '@/assets/images/loader-fuse.gif'
import BigNumber from 'bignumber.js'

const BLOCKS_IN_YEAR = 6307200

const Scheme = object().noUnknown(false).shape({
  amount: number().positive().required(),
  validator: string().required(),
  submitType: mixed().oneOf(['stake', 'unstake']).required().default('stake')
})

const calcRewardPerYourBlocks = (
  rewardPerBlock,
  stakeAmount,
  numberOfValidators,
  totalStakeAmount,
  fee) => new BigNumber(rewardPerBlock)
  .multipliedBy(new BigNumber(stakeAmount))
  .multipliedBy(numberOfValidators)
  .div(new BigNumber(totalStakeAmount))
  .multipliedBy((1 - fee))

export default ({ submitType, handleConnect }) => {
  const dispatch = useDispatch()
  const { accountAddress } = useSelector(state => state.network)
  const accounts = useSelector(state => state.accounts)
  const validators = useSelector(state => state.entities.validators)
  const { validator, isWithdraw, isDelegate } = useSelector(state => state.screens.stake)
  const { totalStakeAmount, numberOfValidators, rewardPerBlock } = useSelector(state => state.consensus)
  const balanceOfNative = get(accounts, [accountAddress, 'balanceOfNative'], 0)
  const yourStake = get(validators, [validator, 'yourStake'], 0)
  const fee = get(validators, [validator, 'fee'], 0)

  const onSubmit = (values, formikBag) => {
    const { amount, submitType } = values
    if (submitType === 'stake') {
      dispatch(delegate(validator, toWei(amount)))
    } else if (submitType === 'unstake') {
      dispatch(withdraw(validator, toWei(amount)))
    }
  }

  const renderForm = ({ dirty, isValid, values }) => {
    const { submitType, amount } = values
    const balanceToShow = submitType === 'stake' ? balanceOfNative : yourStake

    const rewardPerYourBlocks = calcRewardPerYourBlocks(
      rewardPerBlock,
      toWei(amount),
      numberOfValidators,
      totalStakeAmount,
      formatWei(fee)
    )

    const average = rewardPerYourBlocks.div(numberOfValidators)
    const rewardPerYear = average.multipliedBy(BLOCKS_IN_YEAR)
    const estimatedAPR = rewardPerYear.div(amount)

    return (
      <Form className='form'>
        <div className='input__wrapper'>
          <div className={classNames('balance', { 'balance--disabled': !accountAddress })}>Balance - <span>{formatWei(balanceToShow)} FUSE</span></div>
          <div className='input'>
            <Field name='amount'>
              {({
                field
              }) => (
                <input
                  {...field}
                  autoComplete='off'
                  placeholder='0.00'
                />
              )}
            </Field>
            <span className='symbol'>FUSE</span>
          </div>
        </div>
        <PercentageSelector balance={balanceToShow} />
        {
          submitType === 'stake' && (
            <GrayContainer
              modifier='gray_container--fix-width'
              symbol='FUSE'
              estimatedAPR={isNaN(estimatedAPR) ? 0 : (formatWeiToNumber(estimatedAPR) * 100).toFixed(1)}
              title='Project rewards (1Y)'
              end={isNaN(rewardPerYear) ? 0 : formatWeiToNumber(rewardPerYear)}
            />
          )
        }
        {
          accountAddress && (
            <button
              type='submit'
              disabled={!(isValid && dirty)}
              className='button'
            >
              {capitalize(submitType)}&nbsp;&nbsp;
              {
                (isDelegate || isWithdraw) && <img src={FuseLoader} alt='Fuse loader' />
              }
            </button>
          )
        }
        {
          !accountAddress && (
            <button
              onClick={(e) => {
                e.preventDefault()
                handleConnect()
              }}
              className='button'
            >
              <img style={{ width: '16px', marginRight: '.5em' }} className='icon' src={walletIcon} />
              Connect wallet
            </button>
          )
        }
      </Form>
    )
  }

  return (
    <Formik
      initialValues={{
        amount: '',
        validator,
        submitType
      }}
      validationSchema={Scheme}
      render={renderForm}
      onSubmit={onSubmit}
      validateOnChange
      enableReinitialize
    />
  )
}
