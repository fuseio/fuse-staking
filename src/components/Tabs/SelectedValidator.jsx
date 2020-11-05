import React from 'react'
import { useSelector } from 'react-redux'
import useClipboard from 'react-use-clipboard'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Identicon from 'identicon.js'
import { addressShortener } from '@/utils/format'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

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
          <img className='avatar' src={`data:image/png;base64,${new Identicon(address).toString()}`} />
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
      : null
  )
}

export default SelectedValidator
