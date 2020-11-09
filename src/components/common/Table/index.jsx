import React from 'react'
import classNames from 'classnames'
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table'
import ArrowLeft from '@/assets/images/arrow_left.svg'
import ArrowRight from '@/assets/images/arrow_right.svg'
import { Field } from 'formik'
import BodyRow from './BodyRow'
import HeaderRow from './HeaderRow'

const IndeterminateRadio = React.forwardRef(
  ({ indeterminate, fieldName, updateMyData, index, value, onChange, disabled, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <label className={classNames('label', { 'label--disabled': disabled })}>
        <Field type='radio' name='validator' value={value}>
          {({ field, form: { setFieldValue, submitForm } }) => (
            <input
              className='row_checkbox'
              {...rest}
              {...field}
              type='radio'
              id={value}
              disabled={disabled}
              ref={resolvedRef}
              onChange={(e) => {
                onChange(e)
                setFieldValue('validator', value)
                setTimeout(submitForm, 3)
              }}
            />
          )}
        </Field>
        <div className='check' />
      </label>
    )
  }
)

const MyTable = ({
  columns,
  data,
  count,
  size,
  handleClick
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    state: {
      pageIndex
    },
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage
  } = useTable(
    {
      columns,
      data,
      initialState: { pageCount: count, pageSize: size }
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'checkbox',
          Cell: ({ row }) => {
            const { original: { address }, values: { isOpen } } = row
            return (
              <IndeterminateRadio
                {...row.getToggleRowSelectedProps()}
                value={address}
                disabled={!isOpen}
              />
            )
          }
        },
        ...columns
      ])
    }
  )

  return (
    <div className='table__wrapper'>
      <div className='table__actions'>
        <div className='table__title'>Validators</div>
      </div>
      <table {...getTableProps({ className: 'table' })}>
        <thead>
          {headerGroups.map((headerGroup, index) => <HeaderRow key={index} headerGroup={headerGroup} />)}
        </thead>
        <tbody {...getTableBodyProps({ className: 'table__body' })}>
          {
            page.map((row, i) => prepareRow(row) || <BodyRow handleClick={handleClick} key={i} row={row} index={i} />)
          }
        </tbody>
      </table>
      {
        (canNextPage || canPreviousPage) && (
          <div className='table__pagination__wrapper grid-x align-left'>
            <div className='table__pagination cell medium-12 grid-x align-middle align-left'>
              <div className='cell small-12 grid-x align-middle'>
                <div className='cell small-16 page_index'>
                  Page{' '}{pageIndex + 1} of {pageOptions.length}
                </div>
                <div className='grid-x align-middle align-justify cell small-8'>
                  <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    <img src={ArrowLeft} />
                  </button>
                  <button onClick={() => nextPage()} disabled={!canNextPage}>
                    <img src={ArrowRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default React.memo(MyTable)
