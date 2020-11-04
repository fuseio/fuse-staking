import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { useSelector } from 'react-redux'
import DelegationForm from './DelegationForm'
import SelectedValidator from './SelectedValidator'

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

const TabsWrapper = ({ handleConnect }) => {
  const { accountAddress } = useSelector(state => state.network)
  return (
    <div className='tabs__wrapper'>
      <SelectedValidator />
      <Tabs className='tabs' selectedTabClassName={accountAddress ? 'tabs__tab--selected' : 'tabs__tab--disabled'}>
        <TabList className='tabs__list'>
          <CustomTab className='tabs__tab'>Stake</CustomTab>
          <CustomTab className='tabs__tab'>Unstake</CustomTab>
        </TabList>
        <CustomTabPanel className='tabs__panel'>
          <DelegationForm handleConnect={handleConnect} submitType='stake' />
        </CustomTabPanel>
        <CustomTabPanel className='tabs__panel'>
          <DelegationForm handleConnect={handleConnect} submitType='unstake' />
        </CustomTabPanel>
      </Tabs>
    </div>
  )
}

export default TabsWrapper
