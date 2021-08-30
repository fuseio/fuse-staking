import ReactGA from 'react-ga4'
import React from 'react'

function WebsiteCell ({ row: { values: { website } } }) {
  const handleClick = (e) => {
    e.stopPropagation()
    ReactGA.outboundLink({ label: website }, () => {
      console.debug('Fired outbound link event', website)
    })
  }

  if (!website || website.includes('soon')) {
    return <div className='link'>{website}</div>
  }

  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      href={website}
      className='link link--hover'
    >{website}
    </a>
  )
}

export default WebsiteCell
