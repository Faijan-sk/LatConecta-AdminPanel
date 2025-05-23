import React, { useEffect } from 'react'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

import { Button, Form, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

const UserForm = ({ formData, onSuccess }) => {
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
                invalid={!!errors.name}
                placeholder="Enter name of currency"
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z ]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z ]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          <FormFeedback>{errors.name?.message}</FormFeedback>
        </Col>

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
                invalid={!!errors.prefix}
                placeholder="Enter Prefix"
                maxLength={3}
                onKeyPress={(e) => {
                  if (!/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z]/g, '')
                    .toUpperCase()
                    .slice(0, 3) // limit to 3 characters manually too
                  field.onChange(e)
                }}
              />
            )}
          />
          <FormFeedback>{errors.prefix?.message}</FormFeedback>
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
