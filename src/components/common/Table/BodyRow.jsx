import React from 'react'
import isArray from 'lodash/isArray'
import { useSpring, animated } from 'react-spring'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

export default ({
  row,
  index,
  handleClick,
  style = {}
}) => {
  if (!row) {
    return (
      <div>
        <span>Loading more...</span>
      </div>
    )
  }
  const { validator } = useSelector(state => state.screens.stake)
  const { original: { address, isOpen, oldNode } } = row

  const [props, set] = useSpring(() => ({
    transform: 'scale(1)',
    from: { transform: 'scale(0.9995)' },
    config: { tension: 400, mass: 2, velocity: 5 }
  }))

  const updateHover = hovering => ({ transform: `scale(${hovering ? 1.002 : 1})` })

  return (
    <animated.tr
      {...row.getRowProps({
        style,
        className: classNames('table__body__row grid-x align-middle align-spaced', {
          'table__body__row--open': isOpen || oldNode,
          'table__body__row--selected': address === validator,
          'table__body__row--close': !isOpen && !oldNode
        })
      })}
      onClick={(e) => handleClick(row)}
      style={props}
      onMouseEnter={() => isOpen ? set(updateHover(true)) : null}
      onMouseLeave={() => isOpen ? set(updateHover(false)) : null}
    >
      {row.cells.map(cell => {
        const { column: { id }, value } = cell
        const className = id === 'checkbox' || id === 'dropdown'
          ? 'table__body__cell cell small-2 grid-x align-center'
          : `table__body__cell cell align-middle small-${Math.ceil(24 / row.cells.length)}`
        if (id === 'name' && isArray(value)) {
          return (
            <td key={index} {...cell.getCellProps({ className })}>
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
    </animated.tr>
  )
}
