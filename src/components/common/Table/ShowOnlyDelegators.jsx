import React from 'react'
import { Field } from 'formik'

const ShowOnlyDelegators = () => {
  return (
    <div className='grid-x align-middle toggle__wrapper'>
      <label className='toggle'>
        <Field type='checkbox' name='showOnlyDelegators' />
        <div className='toggle__handler'>
          <span className='toggle__handler__indicator' />
        </div>
      </label>
      <div className='text'>Show only validators that have open delegation</div>
    </div>
  )
}

export default ShowOnlyDelegators
