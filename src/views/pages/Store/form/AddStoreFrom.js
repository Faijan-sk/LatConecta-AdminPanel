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
  
  console.log({ formData })
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
      username: 'faizasdn_sk',
      first_name: 'Fadizan',
      last_name: 'Shaikh',
      email: 'faizsdasn@gmail.com',
      password: 'Faizan@123',
      mobile: '1234569870',
      cp: 'ABC',
      dcrn: ['bd18bc05-cf24-4626-83e2-35c417b6baa0'],
      dwip: '192.168.0.101',
      sdwip: '10.0.0.25',
      pwip: '172.16.254.1',
      spwip: '8.8.8.8',
    },
  })
  const colorOptions = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', isFixed: true },
    { value: 'purple', label: 'Purple', color: '#5243AA', isFixed: true },
    { value: 'red', label: 'Red', color: '#FF5630', isFixed: false },
    { value: 'orange', label: 'Orange', color: '#FF8B00', isFixed: false },
    { value: 'yellow', label: 'Yellow', color: '#FFC400', isFixed: false },
  ]

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      console.log(data.uid)
      data.uid
        ? await useJwt.editStore(data.uid, data)
        : await useJwt.addStores(data)

      toast.success('Store added successfully!')
    } catch (error) {
      console.error('Add Store Failed:', error.response?.data || error.message)
      toast.error('Failed to add Store.')
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
          <Label>Password</Label>
          <Controller
            name="password"
            control={control}
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
          <Label>Company Name</Label>
          <Controller
            name="cp"
            control={control}
            rules={{ required: 'Compony name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter Companyy name"
                invalid={!!errors.cp}
              />
            )}
          />
          <FormFeedback>{errors.cp?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Development Whitelist IP</Label>
          <Controller
            name="dwip"
            control={control}
            defaultValue=""
            rules={{
              required: 'Development Whitelist IP is required',
              pattern: {
                value:
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Enter a valid Development Whitelist IP',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter Development Whitelist IP"
                invalid={!!errors.dwip}
              />
            )}
          />
          <FormFeedback>{errors.dwip?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Production Whitelist IP</Label>
          <Controller
            name="pwip"
            control={control}
            defaultValue=""
            rules={{
              required: 'Production Whitelist IP is required',
              pattern: {
                value:
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Enter a valid IPv4 address',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.pwip}
                placeholder="Enter Production Whitelist IP"
              />
            )}
          />
          <FormFeedback>{errors.pwip?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Secondary Production Whitelist IP</Label>
          <Controller
            name="spwip"
            control={control}
            defaultValue=""
            rules={{
              required: 'Secondary Production Whitelist IP is required',
              pattern: {
                value:
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Enter a valid IPv4 address',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.spwip}
                placeholder="Enter Secondary Production Whitelist IP"
              />
            )}
          />
          <FormFeedback>{errors.spwip?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Secondary Development Whitelist IP</Label>
          <Controller
            name="sdwip"
            control={control}
            defaultValue=""
            rules={{
              required: 'Secondary Development Whitelist IP is required',
              pattern: {
                value:
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                message: 'Enter a valid IPv4 address',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // ✅ Allows proper IP entry
                invalid={!!errors.sdwip}
                placeholder="Enter Secondary Development Whitelist IP"
              />
            )}
          />
          <FormFeedback>{errors.sdwip?.message}</FormFeedback>
        </Col>

        {/* <Col sm="12" md="6" className="mb-2">
          <Label>Daily Limit </Label>
          <Controller
            name=""
            control={control}
            rules={{ required: 'Daily Limit is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.username}
                placeholder="Enter daily limit"
              />
            )}
          />
          <FormFeedback>{errors.username?.message}</FormFeedback>
        </Col> */}

        {/* <Col sm="12" md="6" className="mb-2">
          <Label>Weekly Limit </Label>
          <Controller
            name=""
            control={control}
            rules={{ required: 'Weekly Limit is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.username}
                placeholder="Enter Weekly limit"
              />
            )}
          />
          <FormFeedback>{errors.username?.message}</FormFeedback>
        </Col> */}

        {/* <Col sm="12" md="12" className="mb-2">
          <Label>Monthly Limit </Label>
          <Controller
            name=""
            control={control}
            rules={{ required: 'Monthly Limit is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.username}
                placeholder="Enter Monthly limit"
              />
            )}
          />
          <FormFeedback>{errors.username?.message}</FormFeedback>
        </Col> */}
        <Col className="mb-1" md="6" sm="12">
          <Label className="form-label">Select Currency</Label>
          <Controller
            name="dcrn"
            control={control}
            rules={{ required: 'Currency is required' }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                isClearable={false}
                options={currencies.map((item) => ({
                  value: item.uid,
                  label: `${item.name} (${item.prefix})`,
                }))}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                value={
                  field.value
                    ? currencies
                        .filter((item) => field.value.includes(item.uid))
                        .map((item) => ({
                          value: item.uid,
                          label: `${item.name} (${item.prefix})`,
                        }))
                    : []
                }
                onChange={(selectedOptions) => {
                  field.onChange(selectedOptions.map((option) => option.value))
                }}
              />
            )}
          />
          {errors.dcrn && (
            <div className="text-danger mt-1">{errors.dcrn.message}</div>
          )}
        </Col>

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
