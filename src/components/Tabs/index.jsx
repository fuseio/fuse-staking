import React, { useState, useEffect } from 'react'
import get from 'lodash/get'
import { object, number, mixed, string } from 'yup'
import classNames from 'classnames'
import { withFormik, Form } from 'formik'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { useSelector } from 'react-redux'
import DelegationForm from './DelegationForm'
import SelectedValidator from './SelectedValidator'

const Scheme = object().noUnknown(false).shape({
  amount: number().positive().required(),
  validator: string().required(),
  submitType: mixed().oneOf(['stake', 'unstake']).required().default('stake')
})

const CustomTab = ({ children, ...otherProps }) => (
  <Tab {...otherProps}>
    <h1>{children}</h1>
  </Tab>
)

CustomTab.tabsRole = 'Tab'

const CustomTabPanel = ({ children, className, ...otherProps }) => (
  <TabPanel {...otherProps}>
    <div className={className}>{children}</div>
  </TabPanel>
)

CustomTabPanel.tabsRole = 'TabPanel'

const FormWrapper = ({ handleConnect, setFieldValue }) => {
  const { accountAddress } = useSelector(state => state.network)
  const [tabIndex, setTabIndex] = useState(0)
  const { validator } = useSelector(state => state.screens.stake)
  const validators = useSelector(state => state.entities.validators)
  const oldNode = get(validators, [validator, 'oldNode'], false)

  useEffect(() => {
    setFieldValue('validator', validator)
  }, [validator])

  useEffect(() => {
    if (oldNode) {
      handleTabSelection(1)
    } else {
      handleTabSelection(0)
    }
  }, [oldNode])

  const handleTabSelection = (index) => {
    if (oldNode && index === 0) {
      return
    }
    setTabIndex(index)
    setFieldValue('submitType', index === 0 ? 'stake' : 'unstake')
    setFieldValue('amount', '')
  }

  return (
    <Form className='tabs__wrapper'>
      <SelectedValidator />
      <Tabs
        selectedIndex={tabIndex}
        className='tabs'
        selectedTabClassName={accountAddress && validator ? 'tabs__tab--selected' : 'tabs__tab--disabled'}
        onSelect={handleTabSelection}
      >
        <TabList className='tabs__list'>
          <CustomTab className={classNames('tabs__tab', { 'tabs__tab--not-selected': (!validator && tabIndex === 0) || oldNode })}>Stake</CustomTab>
          <CustomTab className={classNames('tabs__tab', { 'tabs__tab--not-selected': !validator && tabIndex === 1 })}>Unstake</CustomTab>
        </TabList>
        <CustomTabPanel className='tabs__panel'>
          <DelegationForm handleConnect={handleConnect} />
        </CustomTabPanel>
        <CustomTabPanel className='tabs__panel'>
          <DelegationForm handleConnect={handleConnect} />
        </CustomTabPanel>
      </Tabs>
    </Form>
  )
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: ({ validator }) => ({
    amount: '',
    validator,
    submitType: 'stake'
  }),
  enableReinitialize: true,
  validateOnChange: true,
  validationSchema: Scheme,
  handleSubmit: (values, { props }) => {
    const { onSubmit } = props
    const { amount, submitType } = values
    onSubmit({ amount, submitType })
  },
  displayName: 'DelegationForm'
})(FormWrapper)

export default MyEnhancedForm
