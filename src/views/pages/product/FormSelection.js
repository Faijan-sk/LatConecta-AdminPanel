import React, { useEffect, useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'

//** imports Forms */
import PlanForm from './form/AddPlanForm'
import TopUpForm from './form/AddTopUpForm'

const component = (data, type) => {
  const cp = {
    1: <PlanForm formData={data} />,
    2: <TopUpForm formData={data} />,
  }

  return cp[type]
}

const TabsJustified = ({ formData }) => {
  const [active, setActive] = useState('1')
  const [editTypes, setEditTypes] = useState(0)

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  useEffect(() => {
    if (formData) {
      const { pt } = formData
      setEditTypes(pt)
    }
    return () => setEditTypes(0)
  }, [formData])

  if (editTypes && formData) {
    return component(formData, editTypes)
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
