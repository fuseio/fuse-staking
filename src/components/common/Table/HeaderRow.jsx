import React from 'react'
import FontAwesome from 'react-fontawesome'

export default ({
  headerGroup
}) => {
  return (
    <tr {...headerGroup.getHeaderGroupProps({ className: 'table__header grid-x align-middle align-spaced' })}>
      {headerGroup.headers.map((column, index) => {
        const { id } = column
        const className = id === 'checkbox' || id === 'dropdown' ? 'table__header__cell cell grid-x align-middle small-2' : `table__header__cell cell grid-x align-middle small-${Math.ceil(24 / headerGroup.headers.length)}`
        return (
          <th key={index} {...column.getHeaderProps({ className })}>
            <span {...column.getSortByToggleProps()}>
              {column.render('Header')}
            </span>
            <span className='table__header__cell__sort'>
              {column.isSorted
                ? (column.isSortedDesc
                  ? <FontAwesome name='arrow-down' />
                  : <FontAwesome name='arrow-up' />)
                : ''}
            </span>
          </th>
        )
      })}
    </tr>
  )
}
