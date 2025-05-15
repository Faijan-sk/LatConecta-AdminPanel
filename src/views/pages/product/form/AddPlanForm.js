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
  console.clear()
  console.log({ formData })
  const [currencies, setCurrencies] = useState([])
  const [vendor, setVendor] = useState([])
  const [skuid, setSkuid] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('') // Store the selected currency name and prefix

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

    // const fetchSkuid = async () => {
    //   try {
    //     const res = await useJwt.getSkuid()
    //     setSkuid(res.data)
    //   } catch (err) {
    //     toast.error('Failed to fetch Skuid')
    //     console.error(err)
    //   }
    // }

    // fetchSkuid()
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
      eso: '',
      Skuid: 'EV1_MS_50_MXN',
      pdn: 'THE_NEIGHBOUR_50_MXN',
      alias_name: 'THE_NEIGHBOUR_50_MXN',
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
      console.log(data.uid)
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
          <FormFeedback>{errors.product_category?.message}</FormFeedback>
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
          <Label>Ammount</Label>
          <Controller
            name="amt"
            control={control}
            defaultValue=""
            rules={{ required: 'Ammount is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.amt}
                placeholder="Enter Ammount"
                type="number"
              />
            )}
          />
          <FormFeedback>{errors.amt?.message}</FormFeedback>
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
                type="number"
              />
            )}
          />
          <FormFeedback>{errors.bundle_fee?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>GB data</Label>
          <Controller
            name="gb"
            control={control}
            defaultValue=""
            rules={{ required: 'Data is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.gb}
                placeholder="Enter data"
              />
            )}
          />
          <FormFeedback>{errors.gb?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Number of SMS</Label>
          <Controller
            name="nos"
            control={control}
            defaultValue=""
            rules={{ required: 'SMS is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.nos}
                placeholder="Enter Number of SMS"
              />
            )}
          />
          <FormFeedback>{errors.nos?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Incoming Call</Label>
          <Controller
            name="ic"
            control={control}
            defaultValue=""
            rules={{ required: 'Incoming call is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Incoming Call"
                invalid={!!errors.ic}
              />
            )}
          />
          <FormFeedback>{errors.ic?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Outgoing Call</Label>
          <Controller
            name="oc"
            control={control}
            defaultValue="1234569870"
            rules={{ required: 'Outgoing Call is required' }}
            render={({ field }) => (
              <Input
                type="number"
                {...field}
                placeholder="Enter Outgoing call"
                invalid={!!errors.oc}
              />
            )}
          />
          <FormFeedback>{errors.oc?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="6" className="mb-2">
          <Label>Special Offer</Label>
          <Controller
            name="eso"
            control={control}
            defaultValue={14}
            rules={{ required: 'Special offer is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.eso}
                placeholder="Enter special offer"
              />
            )}
          />
          <FormFeedback>{errors.eso?.message}</FormFeedback>
        </Col>
        <Col sm="12" md="6" className="mb-2">
          <Label>Skuid</Label>
          <Controller
            name="Skuid"
            control={control}
            defaultValue={14}
            rules={{ required: 'Special offer is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                invalid={!!errors.Skuid}
                placeholder="Enter Skuid"
              />
            )}
          />
          <FormFeedback>{errors.Skuid?.message}</FormFeedback>
        </Col>
        {/* <Col sm="12" md="6" className="mb-2">
          <Label>Select Skuid</Label>
          <Controller
            name="Skuid"
            control={control}
            rules={{ required: 'Skuid is required' }}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.Skuid}>
                <option value="">Select Skuid</option>
                {skuid.map((item) => (
                  <option key={item.uid} value={item.skuId}>
                    {item.skuId}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.Skuid?.message}</FormFeedback>
        </Col> */}

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
              />
            )}
          />
          <FormFeedback>{errors.pdn?.message}</FormFeedback>
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
