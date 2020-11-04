import React from 'react'
import isArray from 'lodash/isArray'

export default ({
  row,
  index,
  style = {}
}) => {
  if (!row) {
    return (
      <div>
        <span>Loading more...</span>
      </div>
    )
  }

  return (
    <tr {...row.getRowProps({ style, className: 'table__body__row grid-x align-middle align-spaced' })}>
      {row.cells.map(cell => {
        const { column: { id }, value } = cell
        const className = id === 'checkbox' || id === 'dropdown' ? 'table__body__cell cell small-2' : `table__body__cell cell grid-x align-middle small-${Math.ceil(24 / row.cells.length)}`
        if (id === 'name' && isArray(value)) {
          return (
            <td key={index} {...cell.getCellProps({ className, style: { display: 'flex', alignItems: 'center', position: 'relative', height: '100%' } })}>
              {value[0].image}
              {value[0].name}
            </td>
          )
        }
        return (
          <td key={index} {...cell.getCellProps({ className })}>
            {cell.render('Cell')}
          </td>
        )
      })}
    </tr>
  )
}
