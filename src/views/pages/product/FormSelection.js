import React, { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'

//** imports Forms */
import PlanForm from './form/AddPlanForm'
import TopUpForm from './form/AddTopUpForm'

const TabsJustified = () => {
  const [active, setActive] = useState('1')

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  return (
    <React.Fragment>
      <Nav tabs justified>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Plan (Bundle)
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Top Up
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId="1">
          <PlanForm />
        </TabPane>
        <TabPane tabId="2">
          <TopUpForm />
        </TabPane>
      </TabContent>
    </React.Fragment>
  )
}
export default TabsJustified
