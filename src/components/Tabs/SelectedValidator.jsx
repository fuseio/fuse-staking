import React from 'react'
import { useSelector } from 'react-redux'
import get from 'lodash/get'
import has from 'lodash/has'
import Identicon from 'identicon.js'

const SelectedValidator = () => {
  const { validator } = useSelector(state => state.screens.stake)
  const validators = useSelector(state => state.entities.validators)
  const validatorData = get(validators, validator)
  return (
    has(validatorData, 'name')
      ? (
        <div className='selected-validator grid-x align-middle'>
          <img className='avatar' src={`data:image/png;base64,${new Identicon(get(validatorData, 'address')).toString()}`} />
          <div className='name'>{get(validatorData, 'name')}</div>
        </div>
      )
      : null
  )
}

export default SelectedValidator
