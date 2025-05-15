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
  const [vendor, setVendor] = useState([])

  // Fetch currencies on load
  console.log(vendor)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await useJwt.getCurrency()
        console.log(res)
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
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      vn: '',
      amt: 0,
      crn: '',
      pcrn: '',
      bundle_fee: 0,
      pt: 1,
      gb: 0,
      dp: 0,
      nos: 0,
      ic: 0,
      oc: 0,
      eso: 0,
      Skuid: 0,
      pdn: '',
      alias_name: '',

      vn_name: '',
      uid: '',
      max_range: 0,
      min_range: 0,
      product: null,
      product_category: '',
    },
  })
  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      data.uid
        ? await useJwt.editProduct(data.uid, data)
        : await useJwt.addProduct(data)

      toast.success('Product added successfully!')
    } catch (error) {
      console.error(
        'Add Product Failed:',
        error.response?.data || error.message
      )
      toast.error('Failed to add Product.')
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
  }, [reset])

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
          <FormFeedback>{errors.product_category?.message}</FormFeedback>
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Select Vendor</Label>
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
          <FormFeedback>{errors.vn?.message}</FormFeedback>
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
          <FormFeedback>{errors.crn?.message}</FormFeedback>
        </Col>

        {/* Hidden field for pcrn */}
        <Controller
          name="pcrn"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />
        <Col sm="12" md="6" className="mb-2">
          <Label>Min Range</Label>
          <Controller
            name="min_range"
            control={control}
            defaultValue=""
            rules={{ required: 'Min Range is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.min_range}
                placeholder="Enter min Range"
                type="number"
              />
            )}
          />
          <FormFeedback>{errors.min_range?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Max Range</Label>
          <Controller
            name="max_range"
            control={control}
            defaultValue=""
            rules={{ required: 'Max range is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.max_range}
                placeholder="Enter Max Range"
                type="number"
              />
            )}
          />
          <FormFeedback>{errors.max_range?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Product Denomination Name</Label>
          <Controller
            name="pdn"
            control={control}
            defaultValue={0}
            rules={{ required: 'product denomination name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.pdn}
                placeholder="Product Denomination Name"
              />
            )}
          />
          <FormFeedback>{errors.pdn?.message}</FormFeedback>
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
                invalid={!!errors.alias_name}
                placeholder="Alias Name"
              />
            )}
          />
          <FormFeedback>{errors.alias_name?.message}</FormFeedback>
        </Col>

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
