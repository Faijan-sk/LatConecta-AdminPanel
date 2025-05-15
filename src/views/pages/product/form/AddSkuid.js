// src/components/UserForm.js
import React, { useEffect, useState } from 'react'

//** import axios  */
import axios from 'axios'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

// ** Utils
import { selectThemeColors } from '@utils'

//**  Third Party Component
import Select, { components } from 'react-select' // eslint-disable-line

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

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await useJwt.getCurrency()
        setCurrencies(res.data) // Assuming it's an array of currency objects
      } catch (err) {
        toast.error('Failed to fetch currencies')
        console.error(err)
      }
    }

    fetchCurrencies()
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      skuId: '',
      price: 0,
      currency: '',
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      const response = await useJwt.addSkuid(data)
      toast.success('Skuid created successfully!')
    } catch (error) {
      console.error('Failed:', error.response?.data || error.message)
      toast.error('Failed to create Skuid.')
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
          <Label>Select Currency</Label>
          <Controller
            name="currency"
            control={control}
            rules={{ required: 'Currency is required' }}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                invalid={!!errors.currency}
                onChange={(e) => {
                  const selectedId = e.target.value
                  const selectedCurrency = currencies.find(
                    (item) => item.id.toString() === selectedId
                  )
                  field.onChange(selectedCurrency?.id || '')
                  // You can optionally set other values here if needed
                }}
              >
                <option value="">Select Currency</option>
                {currencies.map((item) => (
                  <option key={item.uid} value={item.id}>
                    {item.name} ({item.prefix})
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.currency?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Price</Label>
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Price is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.price}
                placeholder="Enter amount"
              />
            )}
          />
          <FormFeedback>{errors.price?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Sku ID</Label>
          <Controller
            name="skuId"
            control={control}
            rules={{ required: 'Sku Id is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.skuId}
                placeholder="Enter Skuid"
              />
            )}
          />
          <FormFeedback>{errors.skuId?.message}</FormFeedback>
        </Col>

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
