import React from 'react'
import { Field } from 'formik'

const ShowOnlyStaked = () => {
  return (
    <div className='grid-x align-middle toggle__wrapper'>
      <label className='toggle'>
        <Field type='checkbox' name='showOnlyStaked'>
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
      <div className='text'>Show only those I have stake in</div>
    </div>
  )
}

export default ShowOnlyStaked
