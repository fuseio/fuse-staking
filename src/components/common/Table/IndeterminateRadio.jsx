import React from 'react'
import classNames from 'classnames'
import { Field } from 'formik'

const IndeterminateRadio = React.forwardRef(
  ({ indeterminate, fieldName, updateMyData, index, value, disabled, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <label className={classNames('label', { 'label--disabled': disabled })}>
        <Field type='radio' name='validator' value={value}>
          {({ field, form: { submitForm } }) => (
            <input
              className='row_checkbox'
              {...rest}
              {...field}
              type='radio'
              id={value}
              disabled={disabled}
              ref={resolvedRef}
              onChange={(e) => {
                setTimeout(submitForm, 3)
              }}
            />
          )}
        </Field>
        <div className='check' />
      </label>
    )
  }
)

export default IndeterminateRadio
