// src/components/UserForm.js
import React, { useEffect } from 'react'

//** import service */
import useJwt from '@src/auth/jwt/useJwt'

//** import toast */
import toast from 'react-hot-toast'

import { Button, Form, Label, Input, FormFeedback, Row, Col } from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

const UserForm = ({ formData }) => {
  console.log({ formData })

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      prefix: '',
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      console.log(data.uid)
      data.uid
        ? await useJwt.editCurreency(data.uid, data)
        : await useJwt.addCurrency(data)

      toast.success('Currency added successfully!')
    } catch (error) {
      console.error(
        'Add Currency Failed:',
        error.response?.data || error.message
      )
      toast.error('Failed to add Currency.')
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
          <Label>Name of the Currency</Label>
          <Controller
            name="name"
            control={control}
            defaultValue="United State Dollar"
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.name}
                placeholder="Enter name of currency"
                onKeyPress={(e) => {
                  // Allow only letters and space
                  if (!/^[a-zA-Z ]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove any character other than letters and spaces
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
            defaultValue="USD"
            rules={{ required: 'Prefix is required' }}
            render={({ field }) => (
              <Input
                {...field}
                invalid={!!errors.prefix}
                placeholder="Enter Prefix"
                onKeyPress={(e) => {
                  // Only allow letters A-Z or a-z
                  if (!/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove non-alphabet characters and convert to uppercase
                  e.target.value = e.target.value
                    .replace(/[^a-zA-Z]/g, '')
                    .toUpperCase()
                  field.onChange(e)
                }}
              />
            )}
          />
          <FormFeedback>{errors.prefix?.message}</FormFeedback>
        </Col>

        <Button type="submit" color="primary">
          Submit
        </Button>
      </Row>
    </Form>
  )
}

export default UserForm
