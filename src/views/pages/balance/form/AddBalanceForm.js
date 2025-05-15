// src/components/UserForm.js
import React, { useEffect, useState, Fragment } from 'react'

//** import axios  */
import axios from 'axios'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

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
import { useForm, Controller } from 'react-hook-form'

const UserForm = ({ formData }) => {
  const [currencies, setCurrencies] = useState([])
  const [stores, setStores] = useState([])
  const [picker, setPicker] = useState(new Date())

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await useJwt.getCurrency()
        setCurrencies(res.data)
      } catch (err) {
        toast.error('Failed to fetch currencies')
        console.error(err)
      }
    }

    const fetchStore = async () => {
      try {
        const res = await useJwt.getStores()

        setStores(res.data)
      } catch (err) {
        toast.error('Failed to fetch stores')
        console.error(err)
      }
    }

    fetchCurrencies()
    fetchStore()
  }, [])

  const reasons = [
    {
      uid: '1',
      value: 'Wire Transaction - Wire Transaction',
    },
  ]

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: 'faizan_sk',
      first_name: 'Faizan',
      last_name: 'Shaikh',
      email: 'faizan@gmail.com',
      password: 'Faizan@123',
      country_code: '+52',
      mobile: '1234569870',
      tca: 14,
      pca: 14,
      soca: 0,
      soct: 0,
      crn: '',
      store: '',
      amount: '',
      reason: '',
      remarks: '',
    },
  })
 
  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      // const response = await useJwt.addVendor(data)
      toast.success('Balance added successfully!')
    } catch (error) {
      console.error(
        'Add balance Failed:',
        error.response?.data || error.message
      )
      toast.error('Failed to add balance.')
    }
  }

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [formData, reset])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12" md="6" className="mb-2">
          <Label>Select Store</Label>
          <Controller
            name="store"
            control={control}
            rules={{ required: 'Store is required' }}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.store}>
                <option value="">Select Store</option>
                {stores.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </Input>
            )}
          />

          <FormFeedback>{errors.store?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Select Currency</Label>          
          <Controller
            name="crn"
            control={control}
            rules={{ required: 'Currency is required' }}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.crn}>
                <option value="">Select Currency</option>
                {currencies.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.name} ({item.prefix})
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.crn?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Transaction Amount</Label>
          <Controller
            name="amount"
            control={control}
            rules={{ required: 'Amount is required' }}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                placeholder="Enter Amount"
                invalid={!!errors.amount}/>
            )}
          />
          <FormFeedback>{errors.amount?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Reasons</Label>
          <Controller
            name="reason" 
            control={control}
            rules={{ required: 'Reason is required' }}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.reason}>
                <option value="">Select Reason</option>
                {reasons.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.value}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.reason?.message}</FormFeedback>
        </Col>

        <Col sm="12" className="mb-2">
          <Label>Remarks</Label>
          <Controller
            name="remarks"
            control={control}
            rules={{ required: 'Remark is required' }}
            render={({ field }) => (
              <Input
                type="textarea"
                {...field}
                placeholder="Enter Remark"
                invalid={!!errors.remarks}
              />
            )}
          />
          <FormFeedback>{errors.remarks?.message}</FormFeedback>
        </Col>

        <Col sm="12" className="mb-2">
          <Label className="form-label" for="inline-picker"> Date </Label>
          <Flatpickr
            value={picker}
            id="hf-picker"
            className="form-control"
            onChange={(date) => setPicker(date)}
            options={{
              altInput: true,
              altFormat: 'F j, Y',
              dateFormat: 'Y-m-d',
            }}
          />
        </Col>

        <Col sm="12">
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UserForm
