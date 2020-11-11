import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form, useFormikContext } from 'formik'
import { object, string, boolean } from 'yup'
import map from 'lodash/map'
import filter from 'lodash/filter'
import sortBy from 'lodash/sortBy'
import Table from '@/components/common/Table'
import TableHeader from '@/components/common/Table/TableHeader'
import TableLoader from '@/components/common/Table/TableLoader'
import { selectValidator } from '@/actions/consensus'
import { formatWei, formatWeiToNumber, addressShortener } from '@/utils/format'
import { addDefaultSrc } from '@/utils/images'

const Shape = object().shape({
  validator: string(),
  showOnlyDelegators: boolean(),
  showOnlyStaked: boolean()
})

const ValidatorsList = () => {
  const { isLoading } = useSelector(state => state.consensus)
  const entities = useSelector(state => state.entities.validators)
  const { setFieldValue, submitForm, values } = useFormikContext()
  const { showOnlyDelegators, showOnlyStaked } = values

  const data = useMemo(() => {
    const rawData = showOnlyDelegators && showOnlyStaked
      ? filter(entities, ({ yourStake, forDelegation }) => !!Number(yourStake) && forDelegation)
      : showOnlyDelegators
        ? filter(entities, ['forDelegation', 1])
        : showOnlyStaked
          ? filter(entities, ({ yourStake }) => !!Number(yourStake))
          : entities
    return sortBy(map(rawData, ({
      yourStake,
      name,
      address,
      fee,
      delegatorsLength,
      stakeAmount,
      upTime,
      forDelegation,
      website
    }) => ({
      name: [
        {
          name: <div className='address'>{name || addressShortener(address)}</div>,
          image: <img className='avatar' src={`${CONFIG.api.boot}/getNodeLogo=${address}`} onError={(e) => addDefaultSrc(e, address)} />
        }
      ],
      address,
      fee: isNaN(formatWeiToNumber(fee)) ? 0 : `${formatWei(fee) * 100} %`,
      delegators: delegatorsLength,
      upTime: `${upTime?.toString()?.substring(0, 4)} %`,
      stakeAmount,
      yourStake,
      website,
      isOpen: forDelegation
    })), [({ isOpen }) => !isOpen])
  }, [entities, showOnlyDelegators, showOnlyStaked])

  const columns = useMemo(() => [
    {
      accessor: 'name',
      Header: <TableHeader header='name' tooltipText='The name of the validator.' id='name' />
    },
    {
      accessor: 'stakeAmount',
      Cell: ({ row: { original: { yourStake, stakeAmount } } }) => (
        <div className='staked'>{yourStake && yourStake !== '0' ? `${formatWei(yourStake)} / ` : ''} {formatWei(stakeAmount)}</div>
      ),
      Header: <TableHeader header='Staked amount' tooltipText='The amount of FUSE staked to each validator.' id='staked' />
    },
    {
      accessor: 'fee',
      Header: <TableHeader header='Fee' tooltipText='The % of the block rewards each validator takes.' id='fee' />
    },
    {
      accessor: 'upTime',
      Header: <TableHeader header='Up time' tooltipText='The % of blocks filled since each validator has been live.' id='upTime' />
    },
    {
      accessor: 'website',
      Header: <TableHeader header='website' id='website' />,
      Cell: ({ row: { values: { website } } }) => website.includes('soon') ? <div className='link'>{website}</div> : <a target='_blank' rel='noopener noreferrer' onClick={(e) => e.stopPropagation()} href={website} className='link link--hover'>{website}</a>
    },
    {
      id: 'dropdown',
      accessor: '',
      Cell: (rowInfo) => <button className='button'><span>Stake</span></button>
    }
  ], [])

  return (
    <div className='validator__list grid-y'>
      {
        isLoading
          ? <TableLoader />
          : (
            <Table
              handleClick={({ original: { address, isOpen } }) => {
                if (isOpen) {
                  setFieldValue('validator', address)
                  setTimeout(submitForm, 3)
                }
              }}
              columns={columns}
              data={data}
              count={Object.keys(entities).length}
              size={10}
            />
          )
      }
    </div>
  )
}

const SelectValidatorForm = () => {
  const dispatch = useDispatch()
  const { validator } = useSelector(state => state.screens.stake)
  const onSubmit = (values, formikBag) => {
    const { validator } = values
    dispatch(selectValidator(validator))
    formikBag.resetForm({ values })
  }

  React.useEffect(() => {
    if (validator) {
      dispatch(selectValidator(validator))
    }
  }, [])

  const renderForm = () => {
    return (
      <Form>
        <ValidatorsList />
      </Form>
    )
  }

  return (
    <Formik
      initialValues={{
        validator,
        showOnlyDelegators: true
      }}
      onSubmit={onSubmit}
      validationSchema={Shape}
      render={renderForm}
    />
  )
}

export default SelectValidatorForm
