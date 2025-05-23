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

  console.log({ formData })
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
                invalid={!!errors.amt}
                placeholder="Enter Amount"
                type="text" // Use text to fully control input
                onKeyPress={(e) => {
                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                  // Prevent more than one dot
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove all but digits and dot; allow only one dot
                  let val = e.target.value
                  // Remove invalid characters
                  val = val.replace(/[^0-9.]/g, '')
                  // Remove all dots except first one
                  const parts = val.split('.')
                  if (parts.length > 2) {
                    val = parts.shift() + '.' + parts.join('')
                  }
                  e.target.value = val
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.amt && <FormFeedback>{errors.amt.message}</FormFeedback>}
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
                invalid={!!errors.bundle_fee}
                placeholder="Enter bundle fee"
                type="text" // Use text to control input fully
                onKeyPress={(e) => {
                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                  // Prevent more than one dot
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove invalid characters except digits and dot
                  let val = e.target.value
                  val = val.replace(/[^0-9.]/g, '')
                  const parts = val.split('.')
                  if (parts.length > 2) {
                    val = parts.shift() + '.' + parts.join('')
                  }
                  e.target.value = val
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.bundle_fee && (
            <FormFeedback>{errors.bundle_fee.message}</FormFeedback>
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
                type="text" // Use text for full control
                invalid={!!errors.gb}
                placeholder="Enter data"
                onKeyPress={(e) => {
                  // Allow only digits and one dot
                  if (!/[0-9.]/.test(e.key)) {
                    e.preventDefault()
                  }
                  // Prevent more than one dot
                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
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
              />
            )}
          />
          {errors.gb && <FormFeedback>{errors.gb.message}</FormFeedback>}
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
                type="text" // Use text for full control
                invalid={!!errors.nos}
                placeholder="Enter Number of SMS"
                onKeyPress={(e) => {
                  // Allow only digits 0-9
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove any non-digit character
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.nos && <FormFeedback>{errors.nos.message}</FormFeedback>}
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
                type="number"
                placeholder="Incoming Call"
                invalid={!!errors.ic}
              />
            )}
          />
          {errors.ic && <FormFeedback>{errors.ic.message}</FormFeedback>}
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Outgoing Call</Label>
          <Controller
            name="oc"
            control={control}
            defaultValue="1234569870"
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                placeholder="Enter Outgoing call"
                invalid={!!errors.oc}
              />
            )}
          />
          {errors.oc && <FormFeedback>{errors.oc.message}</FormFeedback>}
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
                type="text" // use text for full input control
                invalid={!!errors.eso}
                placeholder="Enter special offer"
                onKeyPress={(e) => {
                  // Allow only digits
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove non-digit characters
                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.eso && <FormFeedback>{errors.eso.message}</FormFeedback>}
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
                invalid={!!errors.Skuid}
                placeholder="Enter Skuid"
                onKeyPress={(e) => {
                  // Allow only alphabets and numbers
                  if (!/[a-zA-Z0-9]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove any character that is not a letter or digit
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.Skuid && <FormFeedback>{errors.Skuid.message}</FormFeedback>}
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
                invalid={!!errors.pdn}
                placeholder="Product Denomination Name"
                onKeyPress={(e) => {
                  // Allow only letters, numbers and underscore
                  if (!/[a-zA-Z0-9_]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove all except letters, numbers and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.pdn && <FormFeedback>{errors.pdn.message}</FormFeedback>}
        </Col>

        <Col sm="12" md="6" className="mb-2">
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
                invalid={!!errors.alias_name}
                placeholder="Alias Name"
                onKeyPress={(e) => {
                  // Allow only letters, numbers and underscore
                  if (!/[a-zA-Z0-9_]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove all except letters, numbers and underscore
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          {errors.alias_name && (
            <FormFeedback>{errors.alias_name.message}</FormFeedback>
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
