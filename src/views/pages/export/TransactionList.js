import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = () => {
  const [transactions, setTransactions] = useState([])
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await useJwt.getTransactin(10)
        setTransactions(res.data)
        console.table('the transactions', res.data)
      } catch (err) {
        toast.error('Failed to fetch Vendor')
        console.error(err)
      }
    }

    fetchTransaction()
  }, [])

  const limit = [
    {
      id: 1,
      value: 10,
    },
    {
      id: 2,
      value: 25,
    },
    {
      id: 3,
      value: 50,
    },
    {
      id: 4,
      value: 75,
    },
    {
      id: 5,
      value: 100,
    },
  ]

  return (
    // <Table responsive>
    //   <thead>
    //     <tr>
    //       <th>Sr. No.</th>
    //       <th>Date</th>
    //       <th>Time</th>
    //       <th>Store</th>
    //       <th>Vendor</th>
    //       <th>MSISDN</th>
    //       <th>Status</th>
    //       <th>Transaction Id</th>
    //       <th>Vendor Transaction id</th>
    //       <th>Vendor Error Code</th>
    //       <th>Vendor Error</th>
    //       <th>Platform Transaction Id</th>
    //       <th>Platform Response</th>
    //       <th>Platform Response Message</th>
    //       <th>Product Id</th>
    //       <th>Product Type</th>
    //       <th>Ammount</th>
    //       <th>Product currency</th>
    //       <th>Fx Margin</th>
    //       <th>Tax</th>
    //       <th>Comminssion</th>
    //       <th>Store Currency </th>
    //       <th>Converted Ammount </th>
    //       <th>Vendor Currency</th>
    //       <th>Conversion Rate </th>
    //       <th>Admin Commission</th>
    //       <th>Country</th>
    //       <th>O-B-D-W</th>
    //       <th>C-B-D-W</th>
    //       <th>O-B-A-W</th>
    //       <th>C-B-A-W</th>
    //       <th>O-B-A-CM</th>
    //       <th>C-B-A-CM</th>
    //       <th>O-B-FX</th>
    //       <th>C-B-FX</th>
    //       <th>O-B-TX</th>
    //       <th>C-B-TX</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {transactions.map((item, index) => (
    //       <tr key={index}>
    //         <td>{index + 1}</td>
    //         <th>{item.DATETIME}Date</th>
    //         <th>{item.DATETIME}Time</th>
    //         <th>{item.DISTRIBUTOR}</th>
    //         <th>{item.VENDOR}</th>
    //         <th>{item.MSISDN}</th>
    //         <th>{item.STATUS}</th>
    //         <th>{item.TRANSACTION_ID}</th>
    //         <th>{item.VENDOR_TRANSACTION_ID}</th>
    //         <th>{item.VENDOR_RESPONSE_CODE}</th>
    //         <th>{item.VENDOR_RESPONSE_MESSAGE}</th>
    //         <th>{item.CLIENT_TRANSACTION_ID}</th>
    //         <th>{item.RESPONSE_CODE}</th>
    //         <th>{item.RESPONSE_MESSAGE}</th>
    //         <th>{item.PRODUCT}</th>
    //         <th>{item.PRODUCT_TYPE}</th>
    //         <th>{item.AMOUNT}</th>
    //         <th>{item.PRODUCT_CURRENCY}</th>
    //         <th>{item.FX_MARGIN}</th>
    //         <th>{item.TAX}</th>
    //         <th>{item.COMISSION}</th>
    //         <th>{item.USER_CURRENCY}</th>
    //         <th>{item.CONVERTED_AMOUNT} </th>
    //         <th>{item.VENDOR_CURRENCY}</th>
    //         <th>{item.CONVERSION_RATE}</th>
    //         <th>{item.ADMIN_COMISSION}</th>
    //         <th>{item.COUNTRY}</th>
    //         <th>{item.OPENING_BALANCE}</th>
    //         <th>{item.CLOSING_BALANCE}</th>
    //         <th>{item.OPENING_BALANCE_ADMIN_WALLET}</th>
    //         <th>{item.CLOSING_BALANCE_ADMIN_WALLET}</th>
    //         <th>{item.OPENING_BALANCE_ADMIN_CM}</th>
    //         <th>{item.CLOSING_BALANCE_ADMIN_CM}</th>
    //         <th>{item.OPENING_BALANCE_FX}</th>
    //         <th>{item.CLOSING_BALANCE_FX}</th>
    //         <th>{item.OPENING_BALANCE_TX}</th>
    //         <th>{item.CLOSING_BALANCE_TX}</th>
    //       </tr>
    //     ))}
    //   </tbody>
    // </Table>
    <></>
  )
}

export default TableBasic
