import React, { useState } from 'react'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'

function BalanceHeader() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [balanceData, setBalanceData] = useState(null)

  const Months = [
    { id: '1', Value: 'January' },
    { id: '2', Value: 'February' },
    { id: '3', Value: 'March' },
    { id: '4', Value: 'April' },
    { id: '5', Value: 'May' },
    { id: '6', Value: 'June' },
    { id: '7', Value: 'July' },
    { id: '8', Value: 'August' },
    { id: '9', Value: 'September' },
    { id: '10', Value: 'October' },
    { id: '11', Value: 'November' },
    { id: '12', Value: 'December' },
  ]

  // const onSubmit = (data) => {
  //   console.log(data)
  // }

  return (
    <div className="d-flex">
      <Col sm="12" md="3" className="mb-2 mx-2">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <div style={{ width: '50%' }}>
              <p style={{ fontSize: '15px' }}>Select Month</p>
              <Controller
                name="month"
                control={control}
                rules={{ required: 'Month is required' }}
                render={({ field }) => (
                  <Input type="select" {...field} invalid={!!errors.month}>
                    <option value="">Select Month</option>
                    {Months.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.Value}
                      </option>
                    ))}
                  </Input>
                )}
              />
              <FormFeedback>{errors.month?.message}</FormFeedback>
            </div>
          </Row>
        </Form>
      </Col>
      <Col sm="12" md="3" className="mb-2">
        <p style={{ fontSize: '15px' }}>Latcom:</p>
        <div>
          <p>
            <strong>Fx Margin: </strong>
            0.28
          </p>
          <p>
            <strong>Bundle Fee: </strong>
            8235.25
          </p>
          <p>
            <strong>Commission: </strong>
            40436.73
          </p>
        </div>
      </Col>
      <Col sm="12" md="3" className="mb-2">
        <p style={{ fontSize: '15px' }}> Latcom Mobifin </p>
      </Col>
      <Col sm="12" md="3" className="mb-2 text-primary">
        <p style={{ fontSize: '15px' }}> Refresh Balance </p>
      </Col>
    </div>
  )
}

export default BalanceHeader
