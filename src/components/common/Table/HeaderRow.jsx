import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

export default ({
  headerGroup
}) => {
  return (
    <tr {...headerGroup.getHeaderGroupProps({ className: 'table__header grid-x align-middle align-spaced' })}>
      {headerGroup.headers.map((column, index) => {
        const { id } = column
        const className = id === 'checkbox' || id === 'dropdown'
          ? 'table__header__cell cell grid-x align-middle small-2'
          : `table__header__cell cell grid-x align-middle small-${Math.ceil(24 / headerGroup.headers.length)}`
        return (
          <th key={index} {...column.getHeaderProps({ ...column.getSortByToggleProps(), className })}>
            {column.render('Header')}
            <span className='table__header__cell__sort'>
              {column.isSorted
                ? (column.isSortedDesc
                    ? <FontAwesomeIcon icon={faArrowDown} />
                    : <FontAwesomeIcon icon={faArrowUp} />)
                : ''}
            </span>
          </th>
        )
      })}
    </tr>
  )
}
