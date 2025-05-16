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
                invalid={!!errors.cp}
                onKeyPress={(e) => {
                  // Allow letters, numbers, and spaces only
                  if (!/[a-zA-Z0-9 ]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove all special characters except letters, numbers, and spaces
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                  field.onChange(e)
                }}
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
                onKeyPress={(e) => {
                  // Allow only digits and dots
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove any character other than digits and dots
                  e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                  field.onChange(e)
                }}
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
                placeholder="Enter Production Whitelist IP"
                invalid={!!errors.pwip}
                onKeyPress={(e) => {
                  // Allow only digits and dots while typing
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Clean input, allow only digits and dots
                  e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                  field.onChange(e)
                }}
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
                placeholder="Enter Secondary Production Whitelist IP"
                invalid={!!errors.spwip}
                onKeyPress={(e) => {
                  // Allow only digits and dots
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove invalid chars, allow only digits and dots
                  e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                  field.onChange(e)
                }}
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
                type="text"
                placeholder="Enter Secondary Development Whitelist IP"
                invalid={!!errors.sdwip}
                onKeyPress={(e) => {
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9.]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          <FormFeedback>{errors.sdwip?.message}</FormFeedback>
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
