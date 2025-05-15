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
      const response = await useJwt.addCurrency(data)
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
                invalid={!!errors.name}
                placeholder="Enter Name of the product"
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
// {
//   "id": 7,
//   "uid": "bd18bc05-cf24-4626-83e2-35c417b6baa0",
//   "name": "Indian Rupee",
//   "prefix": "INR"
// }
