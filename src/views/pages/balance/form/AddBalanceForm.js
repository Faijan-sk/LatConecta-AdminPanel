// src/components/UserForm.js
import React, { useEffect, useState } from 'react'

//** import axios  */
import axios from 'axios'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

const UserForm = ({ formData }) => {
  const [currencies, setCurrencies] = useState([])
  const [stores, setStores] = useState([])
  const [picker, setPicker] = useState(new Date())
  const [reasons, setReasons] = useState([]) // ✅ Corrected from '' to []

  // OTP Modal State
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  // To save form data temporarily after first submit
  const [savedFormData, setSavedFormData] = useState(null)
  // OTP input state inside modal
  const [otpInput, setOtpInput] = useState('')

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await useJwt.getCurrency()
        setCurrencies(res.data)
      } catch (err) {
        toast.error('Failed to fetch currencies')
        console.error(err)
      }
    }

    const fetchStore = async () => {
      try {
        const res = await useJwt.getStores()
        setStores(res.data)
      } catch (err) {
        toast.error('Failed to fetch stores')
        console.error(err)
      }
    }

    const fetchReasons = async () => {
      try {
        const res = await useJwt.getReason()
        setReasons(res.data)
      } catch (err) {
        toast.error('Failed to fetch reasons')
        console.error(err)
      }
    }

    fetchReasons()
    fetchCurrencies()
    fetchStore()
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      CN: '',
      TA: '',
      reason: '',
      remarks: '',
      otp: '',
      name: '',
      ut: '3',
    },
  })

  // On first submit - save data and open OTP modal instead of API call
  const onFirstSubmit = (data) => {
    setSavedFormData(data) // Save form data
    setOtpModalOpen(true) // Show OTP modal
  }

  // When OTP is entered and confirmed
  const onOtpSubmit = async () => {
    if (!otpInput.trim()) {
      toast.error('Please enter OTP')
      return
    }

    try {
      // Combine OTP with saved form data
      const finalData = { ...savedFormData, otp: otpInput }

      // Call API with full data
      await useJwt.addBalance(finalData)

      toast.success('Balance added successfully!')

      // Close modal, reset form and OTP input
      setOtpModalOpen(false)
      reset()
      setSavedFormData(null)
      setOtpInput('')
    } catch (error) {
      console.error(
        'Add balance Failed:',
        error.response?.data || error.message
      )
      toast.error('Failed to add balance.')
    }
  }

  // If formData prop changes, reset form with new values
  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [formData, reset])

  return (
    <>
      <Form onSubmit={handleSubmit(onFirstSubmit)}>
        <Row>
          <Col sm="12" md="6" className="mb-2">
            <Label>Select Store</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Store is required' }}
              render={({ field }) => (
                <Input type="select" {...field} invalid={!!errors.name}>
                  <option value="">Select Store</option>
                  {stores.map((item) => (
                    <option key={item.uid} value={item.uid}>
                      {item.first_name} {item.last_name}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.name?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Select Currency</Label>
            <Controller
              name="CN"
              control={control}
              rules={{ required: 'Currency is required' }}
              render={({ field }) => (
                <Input type="select" {...field} invalid={!!errors.CN}>
                  <option value="">Select Currency</option>
                  {currencies.map((item) => (
                    <option key={item.uid} value={item.prefix}>
                      {item.name} ({item.prefix})
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.CN?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Transaction TA</Label>
            <Controller
              name="TA"
              control={control}
              rules={{ required: 'TA is required' }}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="Enter TA"
                  invalid={!!errors.TA}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              )}
            />
            <FormFeedback>{errors.TA?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Reasons</Label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: 'Reason is required' }}
              render={({ field }) => (
                <Input type="select" {...field} invalid={!!errors.reason}>
                  <option value="">Select Reason</option>
                  {reasons.map((item) => (
                    <option key={item.uid} value={item.reason}>
                      {item.reason}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.reason?.message}</FormFeedback>
          </Col>

          <Col sm="12" className="mb-2">
            <Label>remarks</Label>
            <Controller
              name="remarks"
              control={control}
              rules={{ required: 'Remark is required' }}
              render={({ field }) => (
                <Input
                  type="textarea"
                  {...field}
                  placeholder="Enter Remark"
                  invalid={!!errors.remarks}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(
                      /[^a-zA-Z0-9\s]/g,
                      ''
                    )
                    field.onChange(e)
                  }}
                />
              )}
            />
            <FormFeedback>{errors.remarks?.message}</FormFeedback>
          </Col>

          <Col sm="12" className="mb-2">
            <Label className="form-label" for="inline-picker">
              Date
            </Label>
            <Flatpickr
              value={picker}
              id="hf-picker"
              className="form-control"
              onChange={(date) => setPicker(date)}
              options={{
                altInput: true,
                altFormat: 'F j, Y',
                dateFormat: 'Y-m-d',
              }}
            />
          </Col>

          <Col sm="12">
            <Button type="submit" color="primary">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>

      {/* OTP Modal */}
      <Modal
        isOpen={otpModalOpen}
        toggle={() => setOtpModalOpen(!otpModalOpen)}
      >
        <ModalHeader toggle={() => setOtpModalOpen(false)}>
          Enter OTP
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="otp">OTP</Label>
            <Input
              type="text"
              id="otp"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onOtpSubmit}>
            Confirm
          </Button>{' '}
          <Button color="secondary" onClick={() => setOtpModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default UserForm
