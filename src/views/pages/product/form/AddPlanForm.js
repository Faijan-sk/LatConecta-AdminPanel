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

const UserForm = ({ formData, onSuccess }) => {
  console.log('Add Plans', formData)

  // Helper function to show validation error temporarily
  const showValidationError = (setErrorFunction, message) => {
    setErrorFunction(message)
    setTimeout(() => {
      setErrorFunction('')
    }, 5000)
  }

  console.log({ formData })

  const [amountValidationError, setAmountValidationError] = useState('')
  const [inputError, setInputError] = useState('')
  const [gbInputError, setGbInputError] = useState('')
  const [smsInputError, setSmsInputError] = useState('')
  const [icInputError, setIcInputError] = useState('')
  const [ocInputError, setOcInputError] = useState('')
  const [esoInputError, setEsoInputError] = useState('')
  const [skuidInputError, setSkuidInputError] = useState('')
  const [pdnInputError, setPdnInputError] = useState('')
  const [aliasInputError, setAliasInputError] = useState('')
  const [currencies, setCurrencies] = useState([])
  const [vendor, setVendor] = useState([])
  const [skuid, setSkuid] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('') // Store the selected currency name and prefix
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state

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

    const fetchVendors = async () => {
      try {
        const res = await useJwt.getVendor()
        setVendor(res.data) // Assuming it's an array of vendor object
      } catch (err) {
        toast.error('Failed to fetch Vendor')
        console.error(err)
      }
    }
    fetchCurrencies()
    fetchVendors()
  }, [])

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      vn: '',
      amt: '',
      crn: '',
      pcrn: '',
      bundle_fee: '',
      pt: 1,
      gb: 0,
      dp: '0',
      nos: 0,
      ic: 0,
      oc: 0,
      eso: 0,
      Skuid: '',
      pdn: '',
      alias_name: '',
      vn_name: '',
      uid: '',
      max_range: '0',
      min_range: '0',
      product: null,
      product_category: '',
    },
  })

  // Field mapping for API errors to form fields
  const fieldMapping = {
    vendor: 'vn',
    vendor_id: 'vn',
    amount: 'amt',
    currency: 'crn',
    currency_id: 'crn',
    bundle_fee: 'bundle_fee',
    data: 'gb',
    gb_data: 'gb',
    sms: 'nos',
    number_of_sms: 'nos',
    incoming_call: 'ic',
    outgoing_call: 'oc',
    special_offer: 'eso',
    sku_id: 'Skuid',
    skuid: 'Skuid',
    product_denomination_name: 'pdn',
    alias_name: 'alias_name',
    product_category: 'product_category',
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

      // Show generic toast if no specific field errors
      const hasFieldErrors = Object.keys(errors).some(
        (key) =>
          fieldMapping[key] ||
          key in
            [
              'vn',
              'amt',
              'crn',
              'bundle_fee',
              'gb',
              'nos',
              'ic',
              'oc',
              'eso',
              'Skuid',
              'pdn',
              'alias_name',
              'product_category',
            ]
      )

      if (!hasFieldErrors) {
        toast.error(errorData.message || 'Please check the form for errors')
      }
    }
  }

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    setIsSubmitting(true)

    // Clear previous errors
    clearErrors()

    try {
      console.log(data.uid)
      data.uid
        ? await useJwt.editProduct(data.uid, data)
        : await useJwt.addProduct(data)

      toast.success('Product added successfully!')
      if (onSuccess) {
        onSuccess()
      }
      reset()
    } catch (error) {
      console.error(
        'Add Product Failed:',
        error.response?.data || error.message
      )

      // Handle field-specific errors
      if (error.response?.data) {
        handleFieldErrors(error.response.data)
      } else {
        // Generic error
        toast.error('Failed to add Product. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const product_categories = [
    {
      name: 'Altan Product',
      keys: 'A',
    },
    {
      name: 'Normal Product',
      keys: 'N',
    },
  ]

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [reset, formData])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="12" md="6" className="mb-2">
          <Label>Select Product category</Label>
          <Controller
            name="product_category"
            control={control}
            rules={{ required: 'Product Category is required' }}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                invalid={!!errors.product_category}
              >
                <option value="">Select Product Category</option>
                {product_categories.map((item) => (
                  <option key={item.name} value={item.keys}>
                    {item.name}
                  </option>
                ))}
              </Input>
            )}
          />
          {errors.product_category && (
            <FormFeedback>{errors.product_category.message}</FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Vendor</Label>
          <Controller
            name="vn"
            control={control}
            rules={{ required: 'Vendor is required' }}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.vn}>
                <option value="">Select Vendor</option>
                {vendor.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </Input>
            )}
          />
          {errors.vn && <FormFeedback>{errors.vn.message}</FormFeedback>}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Select Currency</Label>
          <Controller
            name="crn"
            control={control}
            rules={{ required: 'Currency is required' }}
            render={({ field }) => (
              <Input
                type="select"
                {...field}
                invalid={!!errors.crn}
                onChange={(e) => {
                  const selectedUid = e.target.value
                  const selectedCurrency = currencies.find(
                    (item) => item.uid === selectedUid
                  )
                  field.onChange(selectedCurrency?.uid || '') // Set the currency name in crn
                  setValue('pcrn', selectedCurrency?.prefix || '') // Set uid in pcrn
                  setSelectedCurrency(
                    selectedCurrency
                      ? `${selectedCurrency.name} (${selectedCurrency.prefix})`
                      : ''
                  ) // Set the selected currency name and prefix for display
                }}
              >
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
        {/* Hidden field for pcrn */}
        <Controller
          name="pcrn"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <Col sm="12" md="6" className="mb-2">
          <Label>Amount</Label>
          <Controller
            name="amt"
            control={control}
            defaultValue=""
            rules={{ required: 'Amount is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.amt || !!amountValidationError}
                placeholder="Enter Amount (e.g., 100.50)"
                type="text" // Use text to fully control input
                onKeyPress={(e) => {
                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    showValidationError(
                      setAmountValidationError,
                      'Only numbers and decimal point are allowed'
                    )
                  }
                  // Prevent more than one dot
                  else if (
                    e.key === '.' &&
                    e.currentTarget.value.includes('.')
                  ) {
                    e.preventDefault()
                    showValidationError(
                      setAmountValidationError,
                      'Only one decimal point is allowed'
                    )
                  }
                  // Prevent leading zeros (except before decimal)
                  else if (e.key === '0' && e.currentTarget.value === '') {
                    // Allow single 0 before decimal, but warn about leading zeros for multi-digit
                    const nextChar = e.currentTarget.value + e.key
                    if (nextChar === '0') {
                      // This is fine, user might type 0.something
                    }
                  }
                  // Prevent multiple leading zeros
                  else if (
                    /[1-9]/.test(e.key) &&
                    e.currentTarget.value === '0'
                  ) {
                    // Replace the leading zero
                    e.currentTarget.value = ''
                  }
                }}
                onInput={(e) => {
                  // Clear validation error when user types valid characters
                  if (amountValidationError) {
                    setAmountValidationError('')
                  }

                  let val = e.target.value

                  // Remove invalid characters
                  const cleanVal = val.replace(/[^0-9.]/g, '')

                  // Handle multiple dots - keep only the first one
                  const parts = cleanVal.split('.')
                  if (parts.length > 2) {
                    val = parts[0] + '.' + parts.slice(1).join('')
                  } else {
                    val = cleanVal
                  }

                  // Prevent multiple leading zeros (except 0.)
                  if (val.length > 1 && val[0] === '0' && val[1] !== '.') {
                    val = val.replace(/^0+/, '0')
                    if (val.length > 1 && val !== '0.') {
                      val = val.substring(1)
                    }
                  }

                  // Limit decimal places to 2
                  if (val.includes('.')) {
                    const [integer, decimal] = val.split('.')
                    if (decimal && decimal.length > 2) {
                      val = integer + '.' + decimal.substring(0, 2)
                      showValidationError(
                        setAmountValidationError,
                        'Maximum 2 decimal places allowed'
                      )
                    }
                  }

                  e.target.value = val
                  field.onChange(e)
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')

                  // Check if pasted content is a valid number
                  if (!/^\d*\.?\d*$/.test(paste)) {
                    e.preventDefault()
                    showValidationError(
                      setAmountValidationError,
                      'Pasted content is not a valid amount. Only numbers and decimal point are allowed'
                    )
                  }
                  // Check for multiple decimal points
                  else if ((paste.match(/\./g) || []).length > 1) {
                    e.preventDefault()
                    showValidationError(
                      setAmountValidationError,
                      'Pasted content contains multiple decimal points'
                    )
                  }
                  // Check decimal places
                  else if (paste.includes('.')) {
                    const [, decimal] = paste.split('.')
                    if (decimal && decimal.length > 2) {
                      e.preventDefault()
                      showValidationError(
                        setAmountValidationError,
                        'Pasted amount has more than 2 decimal places'
                      )
                    }
                  }
                }}
                onBlur={(e) => {
                  // Clean up the value on blur
                  let val = e.target.value

                  // Remove trailing dot
                  if (val.endsWith('.')) {
                    val = val.slice(0, -1)
                    e.target.value = val
                    field.onChange(e)
                  }

                  // Add .00 if it's a whole number and user wants decimal formatting
                  // This is optional - remove if you don't want auto-formatting
                  /*
          if (val && !val.includes('.') && parseFloat(val) > 0) {
            val = parseFloat(val).toFixed(2)
            e.target.value = val
            field.onChange(e)
          }
          */
                }}
              />
            )}
          />
          {(errors.amt || amountValidationError) && (
            <FormFeedback>
              {errors.amt?.message || amountValidationError}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Bundle Fee</Label>
          <Controller
            name="bundle_fee"
            control={control}
            defaultValue=""
            rules={{ required: 'Bundle fee is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.bundle_fee || !!inputError}
                placeholder="Enter bundle fee"
                type="text"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (inputError) setInputError('')
                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setInputError(
                      'Special characters are not allowed. Only numbers and decimal point allowed.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setInputError('')
                    }, 3000)
                  }
                  // Prevent more than one dot
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault()
                    setInputError('Only one decimal point is allowed.')
                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setInputError('')
                    }, 5000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (inputError) setInputError('')
                  // Remove invalid characters except digits and do
                  let val = e.target.value
                  val = val.replace(/[^0-9.]/g, '')
                  const parts = val.split('.')
                  if (parts.length > 2) {
                    val = parts.shift() + '.' + parts.join('')
                  }
                  e.target.value = val
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (inputError) setInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.bundle_fee || inputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {inputError || errors.bundle_fee?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>GB data</Label>
          <Controller
            name="gb"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.gb || !!gbInputError}
                placeholder="Enter data"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (gbInputError) setGbInputError('')

                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                    setGbInputError(
                      'Special characters are not allowed. Only numbers and decimal point allowed.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setGbInputError('')
                    }, 3000)
                  }

                  // Prevent more than one dot
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault()
                    setGbInputError('Only one decimal point is allowed.')

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setGbInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (gbInputError) setGbInputError('')

                  // Remove invalid chars, allow only one dot
                  let val = e.target.value
                  val = val.replace(/[^0-9.]/g, '')
                  const parts = val.split('.')
                  if (parts.length > 2) {
                    val = parts.shift() + '.' + parts.join('')
                  }
                  e.target.value = val
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (gbInputError) setGbInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.gb || gbInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {gbInputError || errors.gb?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Number of SMS</Label>
          <Controller
            name="nos"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.nos || !!smsInputError}
                placeholder="Enter Number of SMS"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (smsInputError) setSmsInputError('')

                  // Allow only digits 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                    setSmsInputError(
                      'Only numbers are allowed. Special characters and letters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setSmsInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (smsInputError) setSmsInputError('')

                  // Remove any non-digit character
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (smsInputError) setSmsInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.nos || smsInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {smsInputError || errors.nos?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Incoming Call</Label>
          <Controller
            name="ic"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Changed to text for full control
                invalid={!!errors.ic || !!icInputError}
                placeholder="Incoming Call"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (icInputError) setIcInputError('')

                  // Allow only digits 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                    setIcInputError(
                      'Only numbers are allowed. Special characters and letters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setIcInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (icInputError) setIcInputError('')

                  // Remove any non-digit character
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (icInputError) setIcInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.ic || icInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {icInputError || errors.ic?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Outgoing Call</Label>
          <Controller
            name="oc"
            control={control}
            defaultValue="1234569870"
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Changed to text for full control
                invalid={!!errors.oc || !!ocInputError}
                placeholder="Enter Outgoing call"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (ocInputError) setOcInputError('')

                  // Allow only digits 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                    setOcInputError(
                      'Only numbers are allowed. Special characters and letters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setOcInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (ocInputError) setOcInputError('')

                  // Remove any non-digit character
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (ocInputError) setOcInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.oc || ocInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {ocInputError || errors.oc?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Special Offer</Label>
          <Controller
            name="eso"
            control={control}
            defaultValue={14}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.eso || !!esoInputError}
                placeholder="Enter special offer"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (esoInputError) setEsoInputError('')

                  // Allow only digits
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                    setEsoInputError(
                      'Only numbers are allowed. Special characters and letters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setEsoInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (esoInputError) setEsoInputError('')

                  // Remove non-digit characters
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (esoInputError) setEsoInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.eso || esoInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {esoInputError || errors.eso?.message}
            </FormFeedback>
          )}
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Skuid</Label>
          <Controller
            name="Skuid"
            control={control}
            defaultValue={14}
            rules={{ required: 'Skuid is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.Skuid || !!skuidInputError}
                placeholder="Enter Skuid"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (skuidInputError) setSkuidInputError('')

                  // Allow alphabets, numbers, and underscore
                  if (!/[a-zA-Z0-9_]/.test(e.key)) {
                    e.preventDefault()
                    setSkuidInputError(
                      'Only letters, numbers, and underscores are allowed. Special characters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setSkuidInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (skuidInputError) setSkuidInputError('')

                  // Keep only letters, digits, and underscores
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (skuidInputError) setSkuidInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.Skuid || skuidInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {skuidInputError || errors.Skuid?.message}
            </FormFeedback>
          )}
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Product Denomination Name</Label>
          <Controller
            name="pdn"
            control={control}
            defaultValue={0}
            rules={{ required: 'Product denomination name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.pdn || !!pdnInputError}
                placeholder="Product Denomination Name"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (pdnInputError) setPdnInputError('')

                  // Allow only letters, numbers and underscore
                  if (!/[a-zA-Z0-9_]/.test(e.key)) {
                    e.preventDefault()
                    setPdnInputError(
                      'Only letters, numbers, and underscores are allowed. Special characters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setPdnInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (pdnInputError) setPdnInputError('')

                  // Remove all except letters, numbers and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (pdnInputError) setPdnInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.pdn || pdnInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {pdnInputError || errors.pdn?.message}
            </FormFeedback>
          )}
        </Col>

        <Col sm="12" md="12" className="mb-2">
          <Label>Alias Name</Label>
          <Controller
            name="alias_name"
            control={control}
            defaultValue={0}
            rules={{ required: 'Alias name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.alias_name || !!aliasInputError}
                placeholder="Alias Name"
                onKeyPress={(e) => {
                  // Clear previous input error
                  if (aliasInputError) setAliasInputError('')

                  // Allow only letters, numbers and underscore
                  if (!/[a-zA-Z0-9_]/.test(e.key)) {
                    e.preventDefault()
                    setAliasInputError(
                      'Only letters, numbers, and underscores are allowed. Special characters are not permitted.'
                    )

                    // Clear error message after 3 seconds
                    setTimeout(() => {
                      setAliasInputError('')
                    }, 3000)
                  }
                }}
                onInput={(e) => {
                  // Clear input error when user starts typing valid input
                  if (aliasInputError) setAliasInputError('')

                  // Remove all except letters, numbers and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                  field.onChange(e)
                }}
                onFocus={() => {
                  // Clear input error when field is focused
                  if (aliasInputError) setAliasInputError('')
                }}
              />
            )}
          />
          {/* Show validation errors or input errors */}
          {(errors.alias_name || aliasInputError) && (
            <FormFeedback style={{ display: 'block' }}>
              {aliasInputError || errors.alias_name?.message}
            </FormFeedback>
          )}
        </Col>

        <Button type="submit" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
