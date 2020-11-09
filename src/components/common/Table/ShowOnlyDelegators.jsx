import React from 'react'
import { Field } from 'formik'

const ShowOnlyDelegators = () => {
  return (
    <div className='grid-x align-middle toggle__wrapper'>
      <label className='toggle'>
        <Field type='checkbox' name='showOnlyDelegators'>
          {({ field }) => (
            <>
              <input
                {...field}
                type='checkbox'
              />
              <div className='toggle__handler'>
                <span className='toggle__handler__indicator' />
              </div>
            </>
          )}
        </Field>
      </label>
      <div className='text'>Show only validators that have open delegation</div>
    </div>
  )
}

export default ShowOnlyDelegators
