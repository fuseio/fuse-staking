import React, { useEffect, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
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
import WebsiteCell from './cells/website'
import StakeAmountCell from './cells/stakeAmount'
// import images from "../../assets/validators/logos";

const Shape = object().shape({
  validator: string(),
  showOnlyDelegators: boolean(),
  showOnlyOldNodes: boolean(),
  showOnlyStaked: boolean()
})

const ValidatorsList = () => {
  const { isLoading } = useSelector((state) => state.consensus)
  const entities = useSelector((state) => state.entities.validators)
  const { setFieldValue, submitForm, values } = useFormikContext()
  const { showOnlyOldNodes, showOnlyDelegators, showOnlyStaked } = values
  const data = useMemo(() => {
    let rawData = showOnlyOldNodes
      ? filter(entities, ['oldNode', true])
      : showOnlyDelegators && showOnlyStaked
        ? filter(
          entities,
          ({ yourStake, forDelegation }) => !!Number(yourStake) && forDelegation
        )
        : showOnlyStaked
          ? filter(entities, ({ yourStake }) => !!Number(yourStake))
          : filter(entities, ['oldNode', false])
    rawData = rawData.map((validator) => {
      const { image } = validator
      if (image) {
        const img = require(`@/assets/images/logos/${image.split('/')[1]}`).default
        return {
          ...validator,
          image: img
        }
      }
      return validator
    })
    return sortBy(
      map(
        rawData,
        ({
          yourStake,
          name,
          image,
          address,
          fee,
          delegatorsLength,
          stakeAmount,
          upTime,
          forDelegation,
          website,
          oldNode
        }) => ({
          name: [
            {
              name: (
                <div className='address'>
                  {name || addressShortener(address)}
                </div>
              ),
              image: (
                <img
                  className='avatar'
                  src={image || ''}
                  onError={(e) => addDefaultSrc(e, address)}
                />
              )
            }
          ],
          address,
          fee: isNaN(formatWeiToNumber(fee)) ? 0 : `${formatWei(fee) * 100} %`,
          delegators: delegatorsLength,
          upTime: `${upTime?.toString()?.substring(0, 4)} %`,
          stakeAmount,
          yourStake,
          website,
          isOpen: formatWeiToNumber(fee) * 100 >= 15,
          oldNode
        })
      ),
      [({ isOpen }) => !isOpen]
    )
  }, [entities, showOnlyDelegators, showOnlyStaked, showOnlyOldNodes])

  const columns = useMemo(
    () =>
      isMobile
        ? [
            {
              accessor: 'name',
              Header: (
                <TableHeader
                  header='name'
                  tooltipText='The name of the validator.'
                  id='name'
                />
              )
            },
            {
              accessor: 'stakeAmount',
              Cell: StakeAmountCell,
              Header: (
                <TableHeader
                  header='Staked amount'
                  tooltipText='The amount of FUSE staked to each validator.'
                  id='staked'
                />
              )
            },
            {
              accessor: 'fee',
              Header: (
                <TableHeader
                  header='Fee'
                  tooltipText='The % of the block rewards each validator takes.'
                  id='fee'
                />
              )
            },
            {
              id: 'dropdown',
              accessor: '',
              Cell: ({
                row: {
                  original: { oldNode }
                }
              }) => (
                <button className='button'>
                  <span>{oldNode ? 'Unstake' : 'Stake'}</span>
                </button>
              )
            }
          ]
        : [
            {
              accessor: 'name',
              Header: (
                <TableHeader
                  header='name'
                  tooltipText='The name of the validator.'
                  id='name'
                />
              )
            },
            {
              accessor: 'stakeAmount',
              Cell: StakeAmountCell,
              Header: (
                <TableHeader
                  header='Staked amount'
                  tooltipText='The amount of FUSE staked to each validator.'
                  id='staked'
                />
              )
            },
            {
              accessor: 'fee',
              Header: (
                <TableHeader
                  header='Fee'
                  tooltipText='The % of the block rewards each validator takes.'
                  id='fee'
                />
              )
            },
            {
              accessor: 'upTime',
              Header: (
                <TableHeader
                  header='Up time'
                  tooltipText='The % of blocks filled by the validator over a 28 day rolling window.'
                  id='upTime'
                />
              )
            },
            {
              accessor: 'website',
              Header: <TableHeader header='website' id='website' />,
              Cell: WebsiteCell
            },
            {
              id: 'dropdown',
              accessor: '',
              Cell: ({
                row: {
                  original: { oldNode }
                }
              }) => (
                <button className='button'>
                  <span>{oldNode ? 'Unstake' : 'Stake'}</span>
                </button>
              )
            }
          ],
    [isMobile]
  )

  const handleSelectValidator = ({
    original: { address, isOpen, oldNode }
  }) => {
    if (isOpen || oldNode) {
      setFieldValue('validator', address)
      setTimeout(submitForm, 3)
    }
  }

  const renderTable = () => {
    return (
      <Table
        handleClick={handleSelectValidator}
        columns={columns}
        data={data}
        count={Object.keys(entities).length}
        size={10}
      />
    )
  }

  return (
    <div className='validator__list grid-y'>
      {isLoading ? <TableLoader /> : renderTable()}
    </div>
  )
}

const SelectValidatorForm = () => {
  const dispatch = useDispatch()
  const { validator } = useSelector((state) => state.screens.stake)
  const onSubmit = (values, formikBag) => {
    const { validator } = values
    dispatch(selectValidator(validator))
    formikBag.resetForm({ values })
  }

  useEffect(() => {
    if (validator) {
      dispatch(selectValidator(validator))
    }
  }, [])

  return (
    <Formik
      initialValues={{
        validator,
        showOnlyDelegators: true
      }}
      onSubmit={onSubmit}
      validationSchema={Shape}
    >
      {(props) => (
        <Form>
          <ValidatorsList />
        </Form>
      )}
    </Formik>
  )
}

export default SelectValidatorForm
