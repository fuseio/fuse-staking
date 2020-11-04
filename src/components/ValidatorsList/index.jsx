import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import Identicon from 'identicon.js'
import map from 'lodash/map'
import ReactTooltip from 'react-tooltip'
import Table from '@/components/common/Table'
import { selectValidator } from '@/actions/consensus'
import { formatWei, formatWeiToNumber } from '@/utils/format'
import InfoIcon from '@/assets/images/info_table_icon.svg'

const Shape = object().shape({
  validator: string()
})

const TableHeader = ({ header, tooltipText, id }) => (
  <div className='grid-x align-middle'>
    <span>{header}</span>
    &nbsp;
    <img src={InfoIcon} data-tip data-for={id} />
    <ReactTooltip className='tooltip' id={id} place='bottom' effect='solid'>
      <div>{tooltipText}</div>
    </ReactTooltip>
  </div>
)

const ValidatorsList = () => {
  const entities = useSelector(state => state.entities.validators)

  const data = useMemo(() => map(entities, ({ yourStake, name, address, fee, delegatorsLength, stakeAmount, upTime }) => ({
    name: [
      {
        name: <div className='address'>{name}</div>,
        image: <img className='avatar' src={`data:image/png;base64,${new Identicon(address).toString()}`} />
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
      Header: <TableHeader header='name' tooltipText='name tooltip' id='name' />
    },
    {
      accessor: 'stakeAmount',
      Cell: ({ row: { original: { yourStake, stakeAmount } } }) => (
        <div className='staked'>{yourStake && yourStake !== '0' ? `${formatWei(yourStake)} / ` : ''} {formatWei(stakeAmount)}</div>
      ),
      Header: <TableHeader header='Staked amount' tooltipText='Staked amount tooltip' id='staked' />
    },
    {
      accessor: 'fee',
      Header: <TableHeader header='Fee cut' tooltipText='Fee cut tooltip' id='fee' />
    },
    {
      accessor: 'upTime',
      Header: <TableHeader header='Up time' tooltipText='Up time tooltip' id='upTime' />
    },
    {
      accessor: 'delegators',
      Header: <TableHeader header='Delegators' tooltipText='Delegators tooltip' id='delegators' />
    }
  ], [])

  return (
    <div className='validator__list grid-y'>
      <Table
        columns={columns}
        data={data}
        count={Object.keys(entities).length}
        size={10}
      />
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
