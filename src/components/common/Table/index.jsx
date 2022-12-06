import React from 'react'
import { useTable, usePagination, useSortBy } from 'react-table'
import { useFormikContext } from 'formik'
import ArrowLeft from '@/assets/images/arrow_left.svg'
import ArrowRight from '@/assets/images/arrow_right.svg'
import BodyRow from './BodyRow'
import HeaderRow from './HeaderRow'
import ShowOnlyDelegators from './ShowOnlyDelegators'
import ShowOnlyOldNodes from './ShowOnlyOldNodes'
import ShowOnlyStaked from './ShowOnlyStaked'

const MyTable = ({
  columns,
  data,
  count,
  size,
  handleClick
}) => {
  const formik = useFormikContext()
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
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'checkbox',
          Cell: ({ row: { index } }) => <div className='number'>{index + 1}</div>
        },
        ...columns
      ])
    }
  )

  return (
    <div className='table__wrapper'>
      <div className='table__actions grid-y'>
        <div className='table__title'>Validators</div>
        <div className='table__radios'>
          {!formik.values.showOnlyOldNodes && <ShowOnlyDelegators />}
          <ShowOnlyOldNodes />
          <ShowOnlyStaked />
        </div>
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
