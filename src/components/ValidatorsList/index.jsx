import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import Table from '@/components/common/Table'
import TableHeader from '@/components/common/Table/TableHeader'
import TableLoader from '@/components/common/Table/TableLoader'
import { selectValidator } from '@/actions/consensus'
import { formatWei, formatWeiToNumber } from '@/utils/format'
import { addDefaultSrc } from '@/utils/images'

const Shape = object().shape({
  validator: string()
})

const ValidatorsList = () => {
  const entities = useSelector(state => state.entities.validators)

  const data = useMemo(() => map(entities, ({
    yourStake,
    name,
    address,
    fee,
    delegatorsLength,
    stakeAmount,
    upTime
  }) => ({
    name: [
      {
        name: <div className='address'>{name}</div>,
        image: <img className='avatar' src={`${CONFIG.api.boot}/getNodeLogo=${address}`} onError={(e) => addDefaultSrc(e, address)} />
      }
    ],
    address,
    fee: isNaN(formatWeiToNumber(fee)) ? 0 : `${formatWei(fee) * 100} %`,
    delegators: delegatorsLength,
    upTime: upTime?.toString()?.substring(0, 4),
    stakeAmount,
    yourStake
  })), [entities])

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
      Header: <TableHeader header='Fee cut' tooltipText='The % of the block rewards each validator takes.' id='fee' />
    },
    {
      accessor: 'upTime',
      Header: <TableHeader header='Up time' tooltipText='The % of blocks filled since each validator has been live.' id='upTime' />
    },
    {
      accessor: 'delegators',
      Header: <TableHeader header='Delegators' tooltipText='The amount of delegators staked to each validator.' id='delegators' />
    }
  ], [])

  return (
    <div className='validator__list grid-y'>
      {
        isEmpty(data)
          ? <TableLoader />
          : (
            <Table
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
  }

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
        validator
      }}
      onSubmit={onSubmit}
      validationSchema={Shape}
      render={renderForm}
      enableReinitialize
    />
  )
}

export default SelectValidatorForm
