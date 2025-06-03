import React, { useState, useEffect } from 'react'
import { Eye } from 'react-feather'
import toast from 'react-hot-toast'
import { Table } from 'reactstrap'
import { useNavigate } from 'react-router-dom'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = () => {
  //** states */
  const [balance, setBalance] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await useJwt.getBalance()
        // console.log(res)
        setBalance(res.data)
      } catch (err) {
        toast.error('Failed to fetch Balance')
        console.error(err)
      }
    }
    fetchBalance()
  }, [])

  const handleViewDetails = (uid) => {
    navigate(`/balance-detail/${uid}`)
  }

  return (
    <>
      {balance.length > 0 ? (
        <Table responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Balance</th>
              <th>Currency</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {balance.map((item, index) => (
              <tr key={item.id || index}>
                <td>
                  <span className="align-middle fw-bold">
                    {item.name__first_name} {item.name__last_name}
                  </span>
                </td>
                <td>{item.balance}</td>
                <td>{item.CN}</td>
                <td>
                  <Eye
                    className="me-50 cursor-pointer"
                    size={15}
                    onClick={() => handleViewDetails(item.name__uid)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-2">There are no records to display</div>
      )}
    </>
  )
}

export default TableBasic
