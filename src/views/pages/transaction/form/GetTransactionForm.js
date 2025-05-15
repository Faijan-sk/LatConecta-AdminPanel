import React, { useEffect, useState } from 'react'

// ** import axios
import axios from 'axios'

// ** import service
import useJwt from '@src/auth/jwt/useJwt'

// ** import toast
import toast from 'react-hot-toast'

// ** Third Party Components
import Flatpickr from 'react-flatpickr'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'

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

const UserForm = ({ setFilterData, limit, offset }) => {
  const [currencies, setCurrencies] = useState([])
  const [vendor, setVendor] = useState([])
  const [stores, setStore] = useState([])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      vn: '',
      store: '',
      created_at__gte: '',
      created_at__lte: '',
      status: '',
      msisdn: '',
    },
  })

  // Fetch vendors and stores
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await useJwt.getVendor()
        setVendor(res.data)
      } catch (err) {
        toast.error('Failed to fetch Vendor')
        console.error(err)
      }
    }

    const fetchStore = async () => {
      try {
        const res = await useJwt.getStores()
        setStore(res.data)
      } catch (err) {
        toast.error('Failed to fetch Store')
        console.error(err)
      }
    }

    fetchStore()
    fetchVendors()
  }, [])

  const onSubmit = async (data) => {
    if (data.vn) {
      const selectedVendor = vendor.filter(({ uid }) => uid === data.vn)
      if (selectedVendor.length > 0) {
        data['vendor__first_name'] = selectedVendor[0].first_name || null
        data['vendor__last_name'] = selectedVendor[0].last_name || null
      }
      delete data.vn
    }

    if (data.store) {
      const selectedDist = stores.filter(({ uid }) => uid === data.store)
      if (selectedDist.length > 0) {
        data['distributor__first_name'] = selectedDist[0].first_name || null
        data['distributor__last_name'] = selectedDist[0].last_name || null
      }
      delete data.store
    }

    const params = new URLSearchParams()
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        params.append(key, data[key])
      }
    })
    // fetchTransaction
    try {
      const { data } = await useJwt.getfilterTransaction(
        `?limit=${limit}&${params}`
      )
      setFilterData(data)
      toast.success('Transaction fetch successfully!')
    } catch (error) {
      toast.error('Transaction fetch failed.')
      console.error(error)
    }
  }

  const status = [
    { uid: '1', value: 'Success' },
    { uid: '2', value: 'Failed' },
  ]

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="6" md="2" className="mb-2">
          <Label>Vendor</Label>
          <Controller
            name="vn"
            control={control}
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

        <Col sm="6" md="2" className="mb-2">
          <Label>Stores</Label>
          <Controller
            name="store"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.store}>
                <option value="">Select Store</option>
                {stores.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.store?.message}</FormFeedback>
        </Col>

        <Col sm="6" md="2" className="mb-2">
          <Label className="form-label" for="from-picker">
            Transaction From
          </Label>
          <Controller
            name="created_at__gte"
            control={control}
            render={({ field }) => (
              <Flatpickr
                id="from-picker"
                className="form-control"
                {...field}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }}
              />
            )}
          />
        </Col>

        <Col sm="6" md="2" className="mb-2">
          <Label className="form-label" for="to-picker">
            Transaction To
          </Label>
          <Controller
            name="created_at__lte"
            control={control}
            render={({ field }) => (
              <Flatpickr
                id="to-picker"
                className="form-control"
                {...field}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }}
              />
            )}
          />
        </Col>

        <Col sm="12" md="2" className="mb-2">
          <Label>Transaction Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.status}>
                <option value="">Select Status</option>
                {status.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.value}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.status?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="2" className="mb-2">
          <Label>MSSISDN</Label>
          <Controller
            name="msisdn"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                invalid={!!errors.msisdn}
                placeholder="MSSISDN"
              />
            )}
          />
          <FormFeedback>{errors.msisdn?.message}</FormFeedback>
        </Col>

        <div className="d-flex justify-content-end p-1">
          <Button color="primary" type="submit">
            Search Transaction
          </Button>
        </div>
      </Row>
    </Form>
  )
}

export default UserForm
