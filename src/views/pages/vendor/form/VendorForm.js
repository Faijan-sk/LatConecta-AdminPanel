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
  const [currencies, setCurrencies] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state

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
    setError,
    clearErrors,
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

  // Field mapping for API errors to form fields
  const fieldMapping = {
    user_name: 'username',
    userName: 'username',
    first_name: 'first_name',
    firstName: 'first_name',
    last_name: 'last_name',
    lastName: 'last_name',
    email_address: 'email',
    emailAddress: 'email',
    email: 'email',
    password: 'password',
    country_code: 'country_code',
    countryCode: 'country_code',
    mobile_number: 'mobile',
    mobileNumber: 'mobile',
    mobile: 'mobile',
    phone: 'mobile',
    tca: 'tca',
    pca: 'pca',
    soca: 'soca',
    soct: 'soct',
    currency: 'crn',
    currency_id: 'crn',
    currencyId: 'crn',
    crn: 'crn',
  }

  // Function to handle API field errors
  const handleFieldErrors = (errorData) => {
    // Clear previous errors
    clearErrors()

    if (errorData && typeof errorData === 'object') {
      // Handle different error response formats
      let errors = {}

      // Format 1: Direct field errors object
      if (errorData.errors) {
        errors = errorData.errors
      }
      // Format 2: Field errors in data property
      else if (errorData.data && errorData.data.errors) {
        errors = errorData.data.errors
      }
      // Format 3: Direct error object
      else {
        errors = errorData
      }

      // Set errors for each field
      Object.keys(errors).forEach((key) => {
        const formField = fieldMapping[key] || key
        const errorMessage = Array.isArray(errors[key])
          ? errors[key][0]
          : errors[key]

        if (errorMessage) {
          setError(formField, {
            type: 'server',
            message: errorMessage,
          })
        }
      })

      // Show generic toast if no specific field errors were mapped
      const hasFieldErrors = Object.keys(errors).some(
        (key) =>
          fieldMapping[key] ||
          [
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
            'country_code',
            'mobile',
            'tca',
            'pca',
            'soca',
            'soct',
            'crn',
          ].includes(key)
      )

      if (!hasFieldErrors) {
        toast.error(errorData.message || 'Please check the form for errors')
      }
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    // Clear previous errors
    clearErrors()

    try {
      data.uid
        ? await useJwt.editVendor(data.uid, data)
        : await useJwt.addVendor(data)

      toast.success('Vendor added successfully!')

      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error('Add Vendor Failed:', error.response?.data || error.message)

      // Handle field-specific errors
      if (error.response?.data) {
        handleFieldErrors(error.response.data)
      } else {
        // Generic error
        toast.error('Failed to add vendor. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
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
                  if (!/[a-zA-Z_]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z_]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.username && (
            <FormFeedback>{errors.username.message}</FormFeedback>
          )}
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>First Name</Label>
          <Controller
            name="first_name"
            control={control}
            rules={{
              required: 'First name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'First name can only contain letters without spaces',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.first_name}
                placeholder="Enter first name"
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^A-Za-z]/g, '')
                  field.onChange(onlyLetters)
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault()
                  }
                }}
              />
            )}
          />
          {errors.first_name && (
            <FormFeedback>{errors.first_name.message}</FormFeedback>
          )}
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Last Name</Label>
          <Controller
            name="last_name"
            control={control}
            rules={{
              required: 'Last name is required',
              pattern: {
                value: /^[A-Za-z]+$/,
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
                    e.preventDefault()
                  }
                }}
              />
            )}
          />
          {errors.last_name && (
            <FormFeedback>{errors.last_name.message}</FormFeedback>
          )}
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
          {errors.password && (
            <FormFeedback>{errors.password.message}</FormFeedback>
          )}
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
          {errors.country_code && (
            <FormFeedback>{errors.country_code.message}</FormFeedback>
          )}
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
                value: /^[0-9]{10}$/,
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
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                  e.target.value = value
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.mobile && (
            <FormFeedback>{errors.mobile.message}</FormFeedback>
          )}
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
          {errors.tca && <FormFeedback>{errors.tca.message}</FormFeedback>}
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
          {errors.pca && <FormFeedback>{errors.pca.message}</FormFeedback>}
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
          {errors.soca && <FormFeedback>{errors.soca.message}</FormFeedback>}
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
          {errors.soct && <FormFeedback>{errors.soct.message}</FormFeedback>}
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
          {errors.crn && <FormFeedback>{errors.crn.message}</FormFeedback>}
        </Col>

        <Button type="submit" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
