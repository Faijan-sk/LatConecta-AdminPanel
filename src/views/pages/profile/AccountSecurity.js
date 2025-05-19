import React, { useState } from 'react'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  Form,
  Row,
  CardBody,
  Button,
  Modal,
  Input,
  ModalBody,
  FormFeedback,
  Col,
  ModalHeader,
} from 'reactstrap'

// ** Toaster
import toast from 'react-hot-toast'

// ** Assume useJwt is imported properly
import useJwt from '@src/auth/jwt/useJwt'

import { useForm, Controller } from 'react-hook-form'

function AccountSecurity(props) {
  const { f2Astatus, checkF2fStatus } = props
  const [localF2AStatus, setLocalF2AStatus] = useState(f2Astatus) // Local state for re-render
  const [openModal, setOpenModal] = useState(false)
  const [qrCodeData, setqrCodeData] = useState('')
  const [secondModal, setSecondModal] = useState(false)

  const toggle = async () => {
    try {
      const { data } = await useJwt.getQr()
      setqrCodeData(data.qr_code)
      toast.success('QR generated successfully')
      setOpenModal(true)
    } catch (err) {
      toast.error('Failed to generate QR code')
      console.error(err)
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = async (data) => {
    console.log('Form submitted:', data)
    try {
      await useJwt.verifyOtp(data)
      await checkF2fStatus()
      toast.success('Otp Verified successfully!')
      setSecondModal(false)
      setLocalF2AStatus(true) // Optional: reflect update after OTP
    } catch (error) {
      console.error(
        'Otp Verification Failed:',
        error.response?.data || error.message
      )
      toast.error('Otp Verification Failed.')
    }
  }

  return (
    <div>
      {localF2AStatus ? (
        <Card>
          <CardBody>
            <div></div>
            <div>
              <h4>
                Two-step verification Two factor authentication is already
                enabled.
              </h4>
              <p>Authentication to Disable:</p>
            </div>

            <div className="form-switch form-check-primary">
              <Input
                type="switch"
                id="switch-primary"
                name="primary"
                defaultChecked
                onChange={async (e) => {
                  const isEnabled = e.target.checked

                  try {
                    if (!isEnabled) {
                      // Call API to disable 2FA
                      await useJwt.desableAuthentication()
                      toast.success(
                        'Two-factor authentication disabled successfully.'
                      )
                      setLocalF2AStatus(false) // Trigger component re-render
                    }
                  } catch (err) {
                    console.error('Failed to disable 2FA:', err)
                    toast.error('Failed to disable two-factor authentication.')
                  }
                }}
              />
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <h4>Two-factor authentication is not enabled yet.</h4>
            <p>
              Two-factor authentication adds an additional layer of security to
              your account by requiring more than just a password to log in.
            </p>
            <Button
              color="primary"
              className="d-flex align-items-center gap-1"
              onClick={toggle}
            >
              Enable two-factor authentication
            </Button>
          </CardBody>
        </Card>
      )}

      {/* First Modal */}
      <Modal
        isOpen={openModal}
        toggle={() => setOpenModal(false)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setOpenModal(false)}>
          <CardTitle tag="h4">Add Authenticator App</CardTitle>
        </ModalHeader>
        <ModalBody>
          <p>
            Using an authenticator app like Google Authenticator, Microsoft
            Authenticator, Authy, or 1Password, scan the QR code. It will
            generate a 6-digit code for you to enter below.
          </p>
          <div className="text-center">
            <img
              src={`data:image/png;base64,${qrCodeData}`}
              alt="QR Code"
              style={{
                maxWidth: '200px',
                margin: '20px auto',
                display: 'block',
              }}
            />
          </div>

          <div className="text-center mt-2">
            <Button
              className="me-2"
              color="secondary"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setOpenModal(false)
                setSecondModal(true)
              }}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Second Modal */}
      <Modal
        isOpen={secondModal}
        toggle={() => setSecondModal(false)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setSecondModal(false)}>
          <CardTitle tag="h4">Add Authenticator App</CardTitle>
        </ModalHeader>
        <ModalBody>
          <h5>Authenticator Apps</h5>
          <p>
            Using an authenticator app like Google Authenticator, Microsoft
            Authenticator, Authy, or 1Password, scan the QR code. It will
            generate a 6-digit code for you to enter below.
          </p>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="12" md="12" className="mb-2">
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: 'Otp is required',
                    pattern: {
                      value: /^\d{6}$/, // Only 6 digits
                      message: 'OTP must be exactly 6 digits and numeric only',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.otp}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6} // Optional: restrict input length
                    />
                  )}
                />
                <FormFeedback>{errors.otp?.message}</FormFeedback>
              </Col>
            </Row>

            <div className="text-center">
              <Button
                className="me-2"
                color="secondary"
                type="button"
                onClick={() => setSecondModal(false)}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Verify
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}


export default AccountSecurity
