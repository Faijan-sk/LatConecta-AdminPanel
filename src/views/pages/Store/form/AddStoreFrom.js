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
  const [usernameError, setUsernameError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailInputError, setEmailInputError] = useState('')
  const [mobileInputError, setMobileInputError] = useState('')
  const [companyInputError, setCompanyInputError] = useState('')
  const [dwipInputError, setDwipInputError] = useState('')
  const [pwipInputError, setPwipInputError] = useState('')
  const [spwipInputError, setSpwipInputError] = useState('')
  const [sdwipInputError, setSdwipInputError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [currencyError, setCurrencyError] = useState('')

  // Loading state for submit button
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      mobile: '',
      cp: '',
      dcrn: [''],
      dwip: '',
      sdwip: '',
      pwip: '',
      spwip: '',
    },
  })

  // Function to clear all API errors
  const clearAllApiErrors = () => {
    setUsernameError('')
    setFirstNameError('')
    setLastNameError('')
    setEmailInputError('')
    setMobileInputError('')
    setCompanyInputError('')
    setDwipInputError('')
    setPwipInputError('')
    setSpwipInputError('')
    setSdwipInputError('')
    setPasswordError('')
    setCurrencyError('')
  }

  // Function to handle API field errors
  const handleApiFieldErrors = (errorResponse) => {
    clearAllApiErrors()

    // Check if errorResponse has field-specific errors
    if (errorResponse && typeof errorResponse === 'object') {
      // Handle different error response structures
      const errors = errorResponse.errors || errorResponse.data || errorResponse

      // Map API field names to state setters
      const fieldErrorMap = {
        username: setUsernameError,
        first_name: setFirstNameError,
        last_name: setLastNameError,
        email: setEmailInputError,
        mobile: setMobileInputError,
        cp: setCompanyInputError,
        company: setCompanyInputError, // Alternative field name
        dwip: setDwipInputError,
        pwip: setPwipInputError,
        spwip: setSpwipInputError,
        sdwip: setSdwipInputError,
        password: setPasswordError,
        dcrn: setCurrencyError,
        currency: setCurrencyError, // Alternative field name
      }

      // Handle different error formats
      Object.keys(fieldErrorMap).forEach((fieldName) => {
        const errorSetter = fieldErrorMap[fieldName]

        // Check for different error formats
        if (errors[fieldName]) {
          if (Array.isArray(errors[fieldName])) {
            // If error is array, take first error message
            errorSetter(errors[fieldName][0])
          } else if (typeof errors[fieldName] === 'string') {
            // If error is string
            errorSetter(errors[fieldName])
          } else if (errors[fieldName].message) {
            // If error has message property
            errorSetter(errors[fieldName].message)
          }
        }
      })

      // Check if no specific field errors were found, show general error
      const hasFieldErrors = Object.keys(fieldErrorMap).some(
        (field) => errors[field] !== undefined
      )

      if (!hasFieldErrors) {
        // Show general error message
        const generalMessage =
          errors.message ||
          errors.error ||
          'An error occurred while processing your request'
        toast.error(generalMessage)
      }
    }
  }

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    setIsSubmitting(true)
    clearAllApiErrors() // Clear previous errors

    try {
      console.log(data.uid)
      data.uid
        ? await useJwt.editStore(data.uid, data)
        : await useJwt.addStores(data)

      toast.success(
        data.uid ? 'Store updated successfully!' : 'Store added successfully!'
      )

      // Optionally reset form after successful submission
      if (!data.uid) {
        reset()
      }
    } catch (error) {
      console.error(
        'Store Operation Failed:',
        error.response?.data || error.message
      )

      // Handle API field errors
      if (error.response?.data) {
        handleApiFieldErrors(error.response.data)
      } else {
        toast.error('Failed to process request.')
      }
    } finally {
      setIsSubmitting(false)
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
                type="text"
                invalid={!!errors.username || !!usernameError}
                placeholder="Enter username"
                onKeyPress={(e) => {
                  if (usernameError) setUsernameError('')

                  // Allow only letters and underscore
                  if (!/[a-zA-Z_]/.test(e.key)) {
                    e.preventDefault()
                    setUsernameError('Only letters and underscore are allowed.')
                    setTimeout(() => setUsernameError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (usernameError) setUsernameError('')

                  // Remove all except letters and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z_]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  if (usernameError) setUsernameError('')
                }}
              />
            )}
          />
          {(errors.username || usernameError) && (
            <FormFeedback style={{ display: 'block' }}>
              {usernameError || errors.username?.message}
            </FormFeedback>
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
                invalid={!!errors.first_name || !!firstNameError}
                placeholder="Enter first name"
                onChange={(e) => {
                  if (firstNameError) setFirstNameError('')

                  const cleanValue = e.target.value.replace(/[^A-Za-z]/g, '')
                  if (cleanValue !== e.target.value) {
                    setFirstNameError(
                      'Only letters are allowed (no spaces, numbers, or special characters).'
                    )
                    setTimeout(() => setFirstNameError(''), 3000)
                  }

                  field.onChange(cleanValue)
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault()
                    setFirstNameError(
                      'Spaces are not allowed in the first name.'
                    )
                    setTimeout(() => setFirstNameError(''), 3000)
                  }
                }}
                onFocus={() => {
                  if (firstNameError) setFirstNameError('')
                }}
              />
            )}
          />
          {(errors.first_name || firstNameError) && (
            <FormFeedback style={{ display: 'block' }}>
              {firstNameError || errors.first_name?.message}
            </FormFeedback>
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
                invalid={!!errors.last_name || !!lastNameError}
                placeholder="Enter last name"
                onChange={(e) => {
                  if (lastNameError) setLastNameError('')

                  const cleanValue = e.target.value.replace(/[^A-Za-z]/g, '')
                  if (cleanValue !== e.target.value) {
                    setLastNameError(
                      'Only letters are allowed (no spaces, numbers, or special characters).'
                    )
                    setTimeout(() => setLastNameError(''), 3000)
                  }

                  field.onChange(cleanValue)
                }}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault()
                    setLastNameError('Spaces are not allowed in the last name.')
                    setTimeout(() => setLastNameError(''), 3000)
                  }
                }}
                onFocus={() => {
                  if (lastNameError) setLastNameError('')
                }}
              />
            )}
          />
          {(errors.last_name || lastNameError) && (
            <FormFeedback style={{ display: 'block' }}>
              {lastNameError || errors.last_name?.message}
            </FormFeedback>
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
                invalid={!!errors.email || !!emailInputError}
                placeholder="Enter email"
                onKeyDown={(e) => {
                  if (emailInputError) setEmailInputError('')

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
                    setEmailInputError(
                      'Only letters, numbers, "@", and "." are allowed.'
                    )
                    setTimeout(() => setEmailInputError(''), 3000)
                  }
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')
                  if (!/^[a-zA-Z0-9@.]+$/.test(paste)) {
                    e.preventDefault()
                    setEmailInputError(
                      'Pasted content contains invalid characters.'
                    )
                    setTimeout(() => setEmailInputError(''), 3000)
                  }
                }}
                onFocus={() => {
                  if (emailInputError) setEmailInputError('')
                }}
              />
            )}
          />
          {(errors.email || emailInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {emailInputError || errors.email?.message}
            </FormFeedback>
          )}
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
                message: 'Enter a valid mobile number (10 to 15 digits)',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter mobile number"
                invalid={!!errors.mobile || !!mobileInputError}
                onKeyPress={(e) => {
                  if (mobileInputError) setMobileInputError('')
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                    setMobileInputError('Only digits are allowed')
                    setTimeout(() => setMobileInputError(''), 3000)
                  }
                  // Prevent typing if length is already 10 or more
                  else if (field.value && field.value.length >= 10) {
                    e.preventDefault()
                    setMobileInputError('Maximum 10 digits allowed')
                    setTimeout(() => setMobileInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (mobileInputError) setMobileInputError('')
                  let digitsOnly = e.target.value.replace(/[^0-9]/g, '')
                  if (digitsOnly.length > 10) {
                    digitsOnly = digitsOnly.slice(0, 10)
                    setMobileInputError('Maximum 10 digits allowed')
                    setTimeout(() => setMobileInputError(''), 3000)
                  }
                  e.target.value = digitsOnly
                  field.onChange(digitsOnly)
                }}
                onFocus={() => {
                  if (mobileInputError) setMobileInputError('')
                }}
              />
            )}
          />
          {(errors.mobile || mobileInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {mobileInputError || errors.mobile?.message}
            </FormFeedback>
          )}
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
                invalid={!!errors.password || !!passwordError}
                placeholder="Enter password"
                onFocus={() => {
                  if (passwordError) setPasswordError('')
                }}
              />
            )}
          />
          {(errors.password || passwordError) && (
            <FormFeedback style={{ display: 'block' }}>
              {passwordError || errors.password?.message}
            </FormFeedback>
          )}
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Company Name</Label>
          <Controller
            name="cp"
            control={control}
            rules={{ required: 'Company name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Enter Company name"
                invalid={!!errors.cp || !!companyInputError}
                onKeyPress={(e) => {
                  if (companyInputError) setCompanyInputError('')
                  if (!/[a-zA-Z0-9 ]/.test(e.key)) {
                    e.preventDefault()
                    setCompanyInputError(
                      'Only letters, numbers, and spaces are allowed.'
                    )
                    setTimeout(() => setCompanyInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (companyInputError) setCompanyInputError('')
                  const filteredValue = e.target.value.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ''
                  )
                  e.target.value = filteredValue
                  field.onChange(filteredValue)
                }}
                onFocus={() => {
                  if (companyInputError) setCompanyInputError('')
                }}
              />
            )}
          />
          {(errors.cp || companyInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {companyInputError || errors.cp?.message}
            </FormFeedback>
          )}
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
                invalid={!!errors.dwip || !!dwipInputError}
                onKeyPress={(e) => {
                  if (dwipInputError) setDwipInputError('')
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setDwipInputError('Only digits and dots are allowed.')
                    setTimeout(() => setDwipInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (dwipInputError) setDwipInputError('')
                  const filteredValue = e.target.value.replace(/[^0-9.]/g, '')
                  e.target.value = filteredValue
                  field.onChange(filteredValue)
                }}
                onFocus={() => {
                  if (dwipInputError) setDwipInputError('')
                }}
              />
            )}
          />
          {(errors.dwip || dwipInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {dwipInputError || errors.dwip?.message}
            </FormFeedback>
          )}
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
                placeholder="Enter Production Whitelist IP"
                invalid={!!errors.pwip || !!pwipInputError}
                onKeyPress={(e) => {
                  if (pwipInputError) setPwipInputError('')
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setPwipInputError('Only digits and dots are allowed.')
                    setTimeout(() => setPwipInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (pwipInputError) setPwipInputError('')
                  const filteredValue = e.target.value.replace(/[^0-9.]/g, '')
                  e.target.value = filteredValue
                  field.onChange(filteredValue)
                }}
                onFocus={() => {
                  if (pwipInputError) setPwipInputError('')
                }}
              />
            )}
          />
          {(errors.pwip || pwipInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {pwipInputError || errors.pwip?.message}
            </FormFeedback>
          )}
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
                placeholder="Enter Secondary Production Whitelist IP"
                invalid={!!errors.spwip || !!spwipInputError}
                onKeyPress={(e) => {
                  if (spwipInputError) setSpwipInputError('')
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setSpwipInputError('Only digits and dots are allowed.')
                    setTimeout(() => setSpwipInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (spwipInputError) setSpwipInputError('')
                  const filteredValue = e.target.value.replace(/[^0-9.]/g, '')
                  e.target.value = filteredValue
                  field.onChange(filteredValue)
                }}
                onFocus={() => {
                  if (spwipInputError) setSpwipInputError('')
                }}
              />
            )}
          />
          {(errors.spwip || spwipInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {spwipInputError || errors.spwip?.message}
            </FormFeedback>
          )}
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
                type="text"
                placeholder="Enter Secondary Development Whitelist IP"
                invalid={!!errors.sdwip || !!sdwipInputError}
                onKeyPress={(e) => {
                  if (sdwipInputError) setSdwipInputError('')
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setSdwipInputError('Only digits and dots are allowed.')
                    setTimeout(() => setSdwipInputError(''), 3000)
                  }
                }}
                onInput={(e) => {
                  if (sdwipInputError) setSdwipInputError('')
                  const filteredValue = e.target.value.replace(/[^0-9.]/g, '')
                  e.target.value = filteredValue
                  field.onChange(filteredValue)
                }}
                onFocus={() => {
                  if (sdwipInputError) setSdwipInputError('')
                }}
              />
            )}
          />
          {(errors.sdwip || sdwipInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {sdwipInputError || errors.sdwip?.message}
            </FormFeedback>
          )}
        </Col>

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
                  if (currencyError) setCurrencyError('')
                  field.onChange(selectedOptions.map((option) => option.value))
                }}
                onFocus={() => {
                  if (currencyError) setCurrencyError('')
                }}
              />
            )}
          />
          {(errors.dcrn || currencyError) && (
            <div className="text-danger mt-1" style={{ fontSize: '0.875rem' }}>
              {currencyError || errors.dcrn?.message}
            </div>
          )}
        </Col>

        <Col xs="12" className="mt-3">
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting}
            className="me-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          {isSubmitting && (
            <div
              className="spinner-border spinner-border-sm ms-2"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </Col>
      </Row>
    </Form>
  )
}

export default UserForm
