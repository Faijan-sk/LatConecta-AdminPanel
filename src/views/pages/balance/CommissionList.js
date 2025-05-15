import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import {
  Table,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = () => {
  const [commissionBalance, setCommissionBalance] = useState(null)

  useEffect(() => {
    const fetchBankCommission = async () => {
      try {
        const { data } = await useJwt.getBankCommissions()
        setCommissionBalance(data)
      } catch (err) {
        toast.error('Failed to fetch Balance')
        console.error('API error:', err)
        setCommissionBalance([])
      }
    }

    fetchBankCommission()
  }, [])

  console.log({ commissionBalance })

  return (
    <Table responsive bordered striped hover>
      {/* <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead> */}
      <tbody>
        {commissionBalance &&
          Object.keys(commissionBalance)?.map((balanceKey, index) => (
            <tr key={index}>
              <th>{balanceKey}</th>
              <td>{commissionBalance[balanceKey]}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  )
}

export default TableBasic
