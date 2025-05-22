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

const UserForm = ({ formData, onSubmitSuccess }) => {
  console.log({ formData })
  const [currencies, setCurrencies] = useState([])

  //**  Fetch currencies on load
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
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      country_code: '',
      mobile: '',
      tca: 14,
      pca: 14,
      soca: 0,
      soct: 0,
      crn: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      data.uid
        ? await useJwt.editVendor(data.uid, data)
        : await useJwt.addVendor(data)

      toast.success('Vendor added successfully!')

      // Form submit success के बाद parent component को notify करें
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error('Add Vendor Failed:', error.response?.data || error.message)
      toast.error('Failed to add vendor.')
    }
  }

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [reset, formData])

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
                type="text"
                invalid={!!errors.username}
                placeholder="Enter username"
                onKeyPress={(e) => {
                  // Allow only letters (a-z, A-Z) and underscore
                  if (!/[a-zA-Z_]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove anything other than letters and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z_]/g, '')
                  field.onChange(e)
                }}
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
            rules={{
              required: 'First name is required',
              pattern: {
                value: /^[A-Za-z]+$/, // only letters, no spaces, no numbers, no special chars
                message: 'First name can only contain letters without spaces',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.first_name}
                placeholder="Enter first name"
                onChange={(e) => {
                  // Remove anything that is not A-Z or a-z
                  const onlyLetters = e.target.value.replace(/[^A-Za-z]/g, '')
                  field.onChange(onlyLetters)
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault() // Prevent space key press
                  }
                }}
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
            rules={{
              required: 'Last name is required',
              pattern: {
                value: /^[A-Za-z]+$/, // Only letters
                message: 'Last name can only contain letters without spaces',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.last_name}
                placeholder="Enter last name"
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^A-Za-z]/g, '')
                  field.onChange(onlyLetters)
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault() // Block space key
                  }
                }}
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
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                // Allows only alphanumeric + @ + . (no spaces, no other special characters)
                value: /^[a-zA-Z0-9@.]+$/,
                message:
                  'Only alphanumeric characters, "@" and "." are allowed',
              },
              validate: (value) =>
                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ||
                'Please enter a valid email address',
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                invalid={!!errors.email}
                placeholder="Enter email"
                onKeyDown={(e) => {
                  const allowedKeys = [
                    ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.'.split(
                      ''
                    ),
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                  ]
                  if (!allowedKeys.includes(e.key)) {
                    e.preventDefault()
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')
                  if (!/^[a-zA-Z0-9@.]+$/.test(paste)) {
                    e.preventDefault()
                  }
                }}
              />
            )}
          />
          {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
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
            rules={{
              required: 'Country code is required',
              pattern: {
                value: /^\+\d+$/,
                message:
                  'Country code must start with + followed by numbers only',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="+XX"
                invalid={!!errors.country_code}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                  ]
                  // Allow numbers and '+' only
                  const isNumber = /^[0-9]$/.test(e.key)
                  const isPlus = e.key === '+'
                  if (!isNumber && !isPlus && !allowedKeys.includes(e.key)) {
                    e.preventDefault()
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')
                  if (!/^\+?\d+$/.test(paste)) {
                    e.preventDefault()
                  }
                }}
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
            defaultValue=""
            rules={{
              required: 'Mobile is required',
              pattern: {
                value: /^[0-9]{10}$/, // exactly 10 digits
                message: 'Enter a valid 10-digit mobile number',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter mobile number"
                invalid={!!errors.mobile}
                maxLength={10}
                onKeyPress={(e) => {
                  // Allow only digits
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Strip non-numeric and enforce 10 digits max
                  let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                  e.target.value = value
                  field.onChange(e)
                }}
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
