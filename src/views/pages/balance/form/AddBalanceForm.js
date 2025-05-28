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
  const [reasons, setReasons] = useState([])

  // OTP Modal State
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  // To save form data temporarily after first submit
  const [savedFormData, setSavedFormData] = useState(null)
  // OTP input state inside modal
  const [otpInput, setOtpInput] = useState('')

  // API validation errors state
  const [apiErrors, setApiErrors] = useState({})

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
    setError,
    clearErrors,
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

  // Custom validation functions
  const validateSpecialCharacters = (value, fieldName) => {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/
    if (specialCharRegex.test(value)) {
      return `Special characters are not allowed in ${fieldName}`
    }
    return true
  }

  const validateNumericInput = (value) => {
    const numericRegex = /^[0-9.]+$/
    if (value && !numericRegex.test(value)) {
      return 'Only numbers and decimal points are allowed'
    }
    return true
  }

  // Clear API errors when user starts typing
  const clearApiError = (fieldName) => {
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  // On first submit - save data and open OTP modal instead of API call
  const onFirstSubmit = (data) => {
    // Clear any previous API errors
    setApiErrors({})
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
      setApiErrors({})
    } catch (error) {
      console.error(
        'Add balance Failed:',
        error.response?.data || error.message
      )

      // Handle field-specific errors from API
      if (error.response?.data?.errors) {
        const apiFieldErrors = error.response.data.errors
        setApiErrors(apiFieldErrors)

        // Set errors in react-hook-form for individual fields
        Object.keys(apiFieldErrors).forEach((fieldName) => {
          setError(fieldName, {
            type: 'api',
            message: apiFieldErrors[fieldName],
          })
        })

        // Close OTP modal to show field errors
        setOtpModalOpen(false)
        toast.error('Please fix the errors and try again')
      } else {
        toast.error('Failed to add balance.')
      }
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
                <Input
                  type="select"
                  {...field}
                  invalid={!!(errors.name || apiErrors.name)}
                  onChange={(e) => {
                    clearApiError('name')
                    clearErrors('name')
                    field.onChange(e)
                  }}
                >
                  <option value="">Select Store</option>
                  {stores.map((item) => (
                    <option key={item.uid} value={item.uid}>
                      {item.first_name} {item.last_name}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>
              {errors.name?.message || apiErrors.name}
            </FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Select Currency</Label>
            <Controller
              name="CN"
              control={control}
              rules={{ required: 'Currency is required' }}
              render={({ field }) => (
                <Input
                  type="select"
                  {...field}
                  invalid={!!(errors.CN || apiErrors.CN)}
                  onChange={(e) => {
                    clearApiError('CN')
                    clearErrors('CN')
                    field.onChange(e)
                  }}
                >
                  <option value="">Select Currency</option>
                  {currencies.map((item) => (
                    <option key={item.uid} value={item.prefix}>
                      {item.name} ({item.prefix})
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.CN?.message || apiErrors.CN}</FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Transaction TA</Label>
            <Controller
              name="TA"
              control={control}
              rules={{
                required: 'TA is required',
                validate: validateNumericInput,
              }}
              render={({ field }) => (
                <Input
                  type="text"
                  {...field}
                  placeholder="Enter TA"
                  invalid={!!(errors.TA || apiErrors.TA)}
                  onChange={(e) => {
                    clearApiError('TA')
                    clearErrors('TA')
                    field.onChange(e)
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                />
              )}
            />
            <FormFeedback>{errors.TA?.message || apiErrors.TA}</FormFeedback>
          </Col>

          <Col sm="12" md="6" className="mb-2">
            <Label>Reasons</Label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: 'Reason is required' }}
              render={({ field }) => (
                <Input
                  type="select"
                  {...field}
                  invalid={!!(errors.reason || apiErrors.reason)}
                  onChange={(e) => {
                    clearApiError('reason')
                    clearErrors('reason')
                    field.onChange(e)
                  }}
                >
                  <option value="">Select Reason</option>
                  {reasons.map((item) => (
                    <option key={item.uid} value={item.reason}>
                      {item.reason}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>
              {errors.reason?.message || apiErrors.reason}
            </FormFeedback>
          </Col>

          <Col sm="12" className="mb-2">
            <Label>Remarks</Label>
            <Controller
              name="remarks"
              control={control}
              rules={{
                required: 'Remark is required',
                validate: (value) =>
                  validateSpecialCharacters(value, 'remarks'),
              }}
              render={({ field }) => (
                <Input
                  type="textarea"
                  {...field}
                  placeholder="Enter Remark"
                  invalid={!!(errors.remarks || apiErrors.remarks)}
                  onChange={(e) => {
                    clearApiError('remarks')
                    clearErrors('remarks')
                    field.onChange(e)
                  }}
                  onInput={(e) => {
                    // Remove special characters in real-time
                    const cleanValue = e.target.value.replace(
                      /[^a-zA-Z0-9\s]/g,
                      ''
                    )
                    if (cleanValue !== e.target.value) {
                      e.target.value = cleanValue
                      field.onChange(e)
                      // Show error if special characters were entered
                      setError('remarks', {
                        type: 'manual',
                        message:
                          'Special characters are not allowed in remarks',
                      })
                    }
                  }}
                />
              )}
            />
            <FormFeedback>
              {errors.remarks?.message || apiErrors.remarks}
            </FormFeedback>
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
