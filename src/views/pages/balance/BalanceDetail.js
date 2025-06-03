import React, { useState, useEffect, Fragment } from 'react'
import { Table, Card, CardHeader, CardTitle } from 'reactstrap'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom' // ✅ To read :uid from route
import useJwt from '@src/auth/jwt/useJwt'

const BalanceDetail = () => {
  const [singleBalance, setSingleBalance] = useState([])
  const { uid } = useParams() // ✅ Get UID from URL

  useEffect(() => {
    const fetchBalanceDetail = async () => {
      try {
        const res = await useJwt.getDetailedBalance(uid) // ✅ Pass uid to API call
        // console.log(res)
        setSingleBalance(res.data) // ✅ Set data for rendering
      } catch (err) {
        toast.error('Failed to fetch Balance')
        console.error(err)
      }
    }
    if (uid) fetchBalanceDetail()
  }, [uid]) // ✅ Depend on uid

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">All Transactions </CardTitle>
        </CardHeader>
        <div className="react-dataTable m-2">
          <Table responsive>
            <thead>
              <tr>
                <th>Sr.no.</th>
                <th>Date</th>
                <th>Name</th>
                <th>Currency</th>
                <th>Transaction Amount</th>
              </tr>
            </thead>
            <tbody>
              {singleBalance.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.Date}</td>
                  <td>
                    <span className="align-middle fw-bold">
                      {item.name.first_name} {item.name.last_name}
                    </span>
                  </td>
                  <td>{item.CN}</td>
                  <td>{item.TA}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </Fragment>
  )
}

export default BalanceDetail
