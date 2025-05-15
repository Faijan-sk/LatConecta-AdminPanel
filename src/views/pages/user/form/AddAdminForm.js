// src/components/UserForm.js
import React, { useEffect, useState } from 'react'

//** import axios  */
import axios from 'axios'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

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

  // Fetch currencies on load

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
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      const response = await useJwt.addVendor(data)

      toast.success('Vendor added successfully!')
    } catch (error) {
      console.error('Add Vendor Failed:', error.response?.data || error.message)
      toast.error('Failed to add vendor.')
    }
  }

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [reset])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12" md="6" className="mb-2">
          <Label>Username</Label>
          <Controller
            name="username"
            control={control}
            defaultValue="BITEL"
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.username}
                placeholder="Enter username"
              />
            )}
          />
          <FormFeedback>{errors.username?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>First Name</Label>
          <Controller
            name="first_name"
            control={control}
            defaultValue="BITEL"
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.first_name}
                placeholder="Enter first name"
              />
            )}
          />
          <FormFeedback>{errors.first_name?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Last Name</Label>
          <Controller
            name="last_name"
            control={control}
            defaultValue="VENDOR"
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.last_name}
                placeholder="Enter last name"
              />
            )}
          />
          <FormFeedback>{errors.last_name?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Email</Label>
          <Controller
            name="email"
            control={control}
            defaultValue="bitel@altan.com"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                invalid={!!errors.email}
                placeholder="Enter email"
              />
            )}
          />
          <FormFeedback>{errors.email?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Password</Label>
          <Controller
            name="password"
            control={control}
            defaultValue="B!N@ry1024"
            rules={{
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                invalid={!!errors.password}
                placeholder="Enter password"
              />
            )}
          />
          <FormFeedback>{errors.password?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Country Code</Label>
          <Controller
            name="country_code"
            control={control}
            defaultValue="+52"
            rules={{ required: 'Country code is required' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="+XX"
                invalid={!!errors.country_code}
              />
            )}
          />
          <FormFeedback>{errors.country_code?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Mobile</Label>
          <Controller
            name="mobile"
            control={control}
            defaultValue="1234569870"
            rules={{
              required: 'Mobile is required',
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: 'Enter a valid mobile number',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter mobile number"
                invalid={!!errors.mobile}
              />
            )}
          />
          <FormFeedback>{errors.mobile?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>TCA</Label>
          <Controller
            name="tca"
            control={control}
            defaultValue={14}
            rules={{ required: 'TCA is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.tca}
                placeholder="TCA"
              />
            )}
          />
          <FormFeedback>{errors.tca?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>PCA</Label>
          <Controller
            name="pca"
            control={control}
            defaultValue={14}
            rules={{ required: 'PCA is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.pca}
                placeholder="PCA"
              />
            )}
          />
          <FormFeedback>{errors.pca?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>SOCA</Label>
          <Controller
            name="soca"
            control={control}
            defaultValue={0}
            rules={{ required: 'SOCA is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.soca}
                placeholder="SOCA"
              />
            )}
          />
          <FormFeedback>{errors.soca?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>SOCT</Label>
          <Controller
            name="soct"
            control={control}
            defaultValue={0}
            rules={{ required: 'SOCT is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.soct}
                placeholder="SOCT"
              />
            )}
          />
          <FormFeedback>{errors.soct?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Select Currency</Label>
          <Controller
            name="crn"
            control={control}
            rules={{ required: 'CRN is required' }}
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

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
// {
//   "id": 7,
//   "uid": "bd18bc05-cf24-4626-83e2-35c417b6baa0",
//   "name": "Indian Rupee",
//   "prefix": "INR"
// }
