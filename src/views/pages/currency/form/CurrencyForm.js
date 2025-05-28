import React, { useEffect, useState } from 'react'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

import { Button, Form, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

const UserForm = ({ formData, onSuccess }) => {
  // Real-time validation error states
  const [nameValidationError, setNameValidationError] = useState('')
  const [prefixValidationError, setPrefixValidationError] = useState('')

  // Helper function to show validation error temporarily
  const showValidationError = (setErrorFunction, message) => {
    setErrorFunction(message)
    setTimeout(() => {
      setErrorFunction('')
    }, 3000)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      name: '',
      prefix: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      if (data.uid) {
        await useJwt.editCurreency(data.uid, data)
      } else {
        await useJwt.addCurrency(data)
      }

      toast.success('Currency added successfully!')

      if (typeof onSuccess === 'function') {
        onSuccess() // ✅ close modal on success
      }
    } catch (error) {
      const backendErrors = error.response?.data?.errors
      const backendMessage = error.response?.data?.message

      if (backendErrors && typeof backendErrors === 'object') {
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field, { type: 'server', message })
        })
      } else if (backendMessage) {
        toast.error(backendMessage)
      } else {
        toast.error('Failed to add Currency.')
        console.error('Add Currency Failed:', error)
      }
    }
  }

  useEffect(() => {
    if (formData) {
      reset(formData)
    }
  }, [formData, reset])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        {/* Currency Name Field */}
        <Col sm="12" md="6" className="mb-2">
          <Label>Name of the Currency</Label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.name || !!nameValidationError}
                placeholder="Enter name of currency"
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z ]$/.test(e.key)) {
                    e.preventDefault()
                    showValidationError(
                      setNameValidationError,
                      'Only letters and spaces are allowed'
                    )
                  }
                }}
                onInput={(e) => {
                  // Clear validation error when user types valid characters
                  if (nameValidationError) {
                    setNameValidationError('')
                  }
                  e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')
                  field.onChange(e)
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')
                  if (!/^[a-zA-Z ]+$/.test(paste)) {
                    e.preventDefault()
                    showValidationError(
                      setNameValidationError,
                      'Pasted content contains invalid characters. Only letters and spaces are allowed'
                    )
                  }
                }}
              />
            )}
          />
          {(errors.name || nameValidationError) && (
            <FormFeedback>
              {errors.name?.message || nameValidationError}
            </FormFeedback>
          )}
        </Col>

        {/* Currency Prefix Field */}
        <Col sm="12" md="6" className="mb-2">
          <Label>Prefix</Label>
          <Controller
            name="prefix"
            control={control}
            defaultValue=""
            rules={{
              required: 'Prefix is required',
              maxLength: {
                value: 3,
                message: 'Prefix cannot be more than 3 characters',
              },
              pattern: {
                value: /^[A-Z]+$/,
                message: 'Prefix must only contain letters (A-Z)',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.prefix || !!prefixValidationError}
                placeholder="Enter Prefix (e.g., USD)"
                maxLength={3}
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault()
                    showValidationError(
                      setPrefixValidationError,
                      'Only letters are allowed (no numbers or special characters)'
                    )
                  } else if (field.value && field.value.length >= 3) {
                    e.preventDefault()
                    showValidationError(
                      setPrefixValidationError,
                      'Prefix cannot be more than 3 characters'
                    )
                  }
                }}
                onInput={(e) => {
                  // Clear validation error when user types valid characters
                  if (prefixValidationError) {
                    setPrefixValidationError('')
                  }
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z]/g, '')
                    .toUpperCase()
                    .slice(0, 3) // limit to 3 characters manually too
                  field.onChange(e)
                }}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text')
                  if (!/^[a-zA-Z]+$/.test(paste)) {
                    e.preventDefault()
                    showValidationError(
                      setPrefixValidationError,
                      'Pasted content contains invalid characters. Only letters are allowed'
                    )
                  } else if (paste.length > 3) {
                    e.preventDefault()
                    showValidationError(
                      setPrefixValidationError,
                      'Pasted content is too long. Maximum 3 characters allowed'
                    )
                  }
                }}
              />
            )}
          />
          {(errors.prefix || prefixValidationError) && (
            <FormFeedback>
              {errors.prefix?.message || prefixValidationError}
            </FormFeedback>
          )}
        </Col>

        <Col sm="12">
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UserForm
