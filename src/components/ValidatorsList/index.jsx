import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Formik, Form } from 'formik'
import { object, string } from 'yup'
import Identicon from 'identicon.js'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import ReactTooltip from 'react-tooltip'
import Table from '@/components/common/Table'
import { selectValidator } from '@/actions/consensus'
import { formatWei, formatWeiToNumber } from '@/utils/format'
import InfoIcon from '@/assets/images/info_table_icon.svg'
import ContentLoader from 'react-content-loader'

const TableLoader = props => (
  <ContentLoader
    width='100%'
    height='100%'
    viewBox='0 0 1000 550'
    backgroundColor='#eaeced'
    foregroundColor='#ffffff'
    {...props}
  >
    <rect x='51' y='45' rx='3' ry='3' width='906' height='17' />
    <circle cx='879' cy='123' r='11' />
    <circle cx='914' cy='123' r='11' />
    <rect x='104' y='115' rx='3' ry='3' width='141' height='15' />
    <rect x='305' y='114' rx='3' ry='3' width='299' height='15' />
    <rect x='661' y='114' rx='3' ry='3' width='141' height='15' />
    <rect x='55' y='155' rx='3' ry='3' width='897' height='2' />
    <circle cx='880' cy='184' r='11' />
    <circle cx='915' cy='184' r='11' />
    <rect x='105' y='176' rx='3' ry='3' width='141' height='15' />
    <rect x='306' y='175' rx='3' ry='3' width='299' height='15' />
    <rect x='662' y='175' rx='3' ry='3' width='141' height='15' />
    <rect x='56' y='216' rx='3' ry='3' width='897' height='2' />
    <circle cx='881' cy='242' r='11' />
    <circle cx='916' cy='242' r='11' />
    <rect x='106' y='234' rx='3' ry='3' width='141' height='15' />
    <rect x='307' y='233' rx='3' ry='3' width='299' height='15' />
    <rect x='663' y='233' rx='3' ry='3' width='141' height='15' />
    <rect x='57' y='274' rx='3' ry='3' width='897' height='2' />
    <circle cx='882' cy='303' r='11' />
    <circle cx='917' cy='303' r='11' />
    <rect x='107' y='295' rx='3' ry='3' width='141' height='15' />
    <rect x='308' y='294' rx='3' ry='3' width='299' height='15' />
    <rect x='664' y='294' rx='3' ry='3' width='141' height='15' />
    <rect x='58' y='335' rx='3' ry='3' width='897' height='2' />
    <circle cx='881' cy='363' r='11' />
    <circle cx='916' cy='363' r='11' />
    <rect x='106' y='355' rx='3' ry='3' width='141' height='15' />
    <rect x='307' y='354' rx='3' ry='3' width='299' height='15' />
    <rect x='663' y='354' rx='3' ry='3' width='141' height='15' />
    <rect x='57' y='395' rx='3' ry='3' width='897' height='2' />
    <circle cx='882' cy='424' r='11' />
    <circle cx='917' cy='424' r='11' />
    <rect x='107' y='416' rx='3' ry='3' width='141' height='15' />
    <rect x='308' y='415' rx='3' ry='3' width='299' height='15' />
    <rect x='664' y='415' rx='3' ry='3' width='141' height='15' />
    <rect x='55' y='453' rx='3' ry='3' width='897' height='2' />
    <rect x='51' y='49' rx='3' ry='3' width='2' height='465' />
    <rect x='955' y='49' rx='3' ry='3' width='2' height='465' />
    <circle cx='882' cy='484' r='11' />
    <circle cx='917' cy='484' r='11' />
    <rect x='107' y='476' rx='3' ry='3' width='141' height='15' />
    <rect x='308' y='475' rx='3' ry='3' width='299' height='15' />
    <rect x='664' y='475' rx='3' ry='3' width='141' height='15' />
    <rect x='55' y='513' rx='3' ry='3' width='897' height='2' />
    <rect x='52' y='80' rx='3' ry='3' width='906' height='17' />
    <rect x='53' y='57' rx='3' ry='3' width='68' height='33' />
    <rect x='222' y='54' rx='3' ry='3' width='149' height='33' />
    <rect x='544' y='55' rx='3' ry='3' width='137' height='33' />
    <rect x='782' y='56' rx='3' ry='3' width='72' height='33' />
    <rect x='933' y='54' rx='3' ry='3' width='24' height='33' />
  </ContentLoader>
)

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
