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
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      const response = await useJwt.addAltanProduct(data)
      toast.success('Product added successfully!')
    } catch (error) {
      console.error(
        'Add Product Failed:',
        error.response?.data || error.message
      )
      toast.error('Failed to add Product.')
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
        <Col sm="12" md="12" className="mb-2">
          <Label>Name of Product</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
               
                invalid={!!errors.name}
                placeholder="Enter Name of the product"
                onKeyPress={(e) => {
                  // Allow letters, numbers, and spaces only
                  if (!/[a-zA-Z0-9 ]/.test(e.key)) {
                    e.preventDefault()
                  }
                }}
                onInput={(e) => {
                  // Remove special characters except letters, numbers, and spaces
                  e.target.value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
                  field.onChange(e)
                }}
              />
            )}
          />
          <FormFeedback>{errors.name?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="4" className="mb-2">
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default UserForm
