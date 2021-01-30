import React from 'react'
import { Field } from 'formik'

function ShowOnlyOldNodes () {
  return (
    <div className='grid-x align-middle toggle__wrapper'>
      <label className='toggle'>
        <Field type='checkbox' name='showOnlyOldNodes' />
        <div className='toggle__handler'>
          <span className='toggle__handler__indicator' />
        </div>
      </label>
      <div className='text'>Show only old validators</div>
    </div>
  )
}

export default ShowOnlyOldNodes
