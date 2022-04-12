import React from 'react'
import { useSelector } from 'react-redux'
import useClipboard from 'react-use-clipboard'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { addressShortener } from '@/utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import ContentLoader from 'react-content-loader'
import { addDefaultSrc } from '@/utils/images'

const AvatarWithText = props => (
  <ContentLoader viewBox='0 0 400 100' height='100%' width='100%' {...props}>
    <rect x='110' y='21' rx='4' ry='4' width='254' height='6' />
    <rect x='111' y='41' rx='3' ry='3' width='185' height='7' />
    <rect x='304' y='-46' rx='3' ry='3' width='350' height='6' />
    <rect x='371' y='-45' rx='3' ry='3' width='380' height='6' />
    <rect x='484' y='-45' rx='3' ry='3' width='201' height='6' />
    <circle cx='50' cy='50' r='40' />
  </ContentLoader>
)

const SelectedValidator = () => {
  const { validator } = useSelector(state => state.screens.stake)
  const validators = useSelector(state => state.entities.validators)
  const validatorData = get(validators, validator)
  const address = get(validatorData, 'address')
  const name = get(validatorData, 'name')
  const [isCopied, setCopied] = useClipboard(address, { successDuration: 1000 })
  return (
    !isEmpty(validatorData)
      ? (
        <div className='selected-validator grid-x align-middle'>
          <img className='avatar' src={`${CONFIG.api.boot}/getNodeLogo=${address}`} onError={(e) => addDefaultSrc(e, address)} />
          <div className='grid-y align-top content'>
            <div className='name'>{name}</div>
            <div className='address'>
              {addressShortener(address)}
              <FontAwesomeIcon className='copy' icon={faCopy} onClick={setCopied} />
              {
                isCopied && (
                  <div className='copied_tooltip'>
                    Copied
                  </div>
                )
              }
            </div>
          </div>
        </div>
        )
      : <AvatarWithText />
  )
}

export default SelectedValidator
