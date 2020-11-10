import React from 'react'
import ReactTooltip from 'react-tooltip'
import InfoIcon from '@/assets/images/info_table_icon.svg'

const TableHeader = ({ header, tooltipText, id }) => (
  <div className='grid-x align-middle'>
    <span>{header}</span>
    &nbsp;
    {tooltipText && (
      <>
        <img src={InfoIcon} data-tip data-for={id} />
        <ReactTooltip className='tooltip' id={id} place='top' effect='solid'>
          <div>{tooltipText}</div>
        </ReactTooltip>
      </>
    )}

  </div>
)

export default TableHeader
