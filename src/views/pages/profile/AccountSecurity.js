import React, { useState, useEffect } from 'react'

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

  // Debug logs to check status
  console.log('f2Astatus prop:', f2Astatus)
  console.log('localF2AStatus:', localF2AStatus)

  // Update local state when prop changes
  useEffect(() => {
    setLocalF2AStatus(f2Astatus)
  }, [f2Astatus])

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
      toast.success('OTP Verified successfully!')
      setSecondModal(false)
      reset() // Reset the form
      setLocalF2AStatus(true) // Update local state to show enabled UI
    } catch (error) {
      console.error(
        'OTP Verification Failed:',
        error.response?.data || error.message
      )
      toast.error('OTP Verification Failed.')
    }
  }

  const handleDisable2FA = async (e) => {
    const isEnabled = e.target.checked

    try {
      if (!isEnabled) {
        // Call API to disable 2FA
        await useJwt.desableAuthentication()
        toast.success('Two-factor authentication disabled successfully.')
        setLocalF2AStatus(false) // Update local state
        await checkF2fStatus() // Refresh status from parent
      } else {
        // If user tries to enable again, show enable flow
        setLocalF2AStatus(true)
      }
    } catch (err) {
      console.error('Failed to disable 2FA:', err)
      toast.error('Failed to disable two-factor authentication.')
      // Reset switch to previous state on error
      e.target.checked = true
    }
  }

  return (
    <div>
      {localF2AStatus ? (
        <Card>
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                <i
                  className="fas fa-shield-alt text-success"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <div>
                <h4 className="mb-1">Two-Factor Authentication Enabled</h4>
                <p className="mb-0 text-muted">
                  Your account is secured with 2FA
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6>Disable Two-Factor Authentication</h6>
                <p className="text-muted small">
                  Turn off 2FA for your account
                </p>
              </div>
              <div className="form-switch form-check-primary">
                <Input
                  type="switch"
                  id="switch-primary"
                  name="primary"
                  defaultChecked={localF2AStatus}
                  onChange={handleDisable2FA}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                <i
                  className="fas fa-shield-alt text-warning"
                  style={{ fontSize: '24px' }}
                ></i>
              </div>
              <div>
                <h4 className="mb-1">Two-Factor Authentication</h4>
                <p className="mb-0 text-muted">Not enabled</p>
              </div>
            </div>

            <p className="mb-3">
              Two-factor authentication adds an additional layer of security to
              your account by requiring more than just a password to log in.
            </p>

            <Button
              color="primary"
              className="d-flex align-items-center gap-2"
              onClick={toggle}
            >
              <i className="fas fa-plus"></i>
              Enable Two-Factor Authentication
            </Button>
          </CardBody>
        </Card>
      )}

      {/* First Modal - QR Code Display */}
      <Modal
        isOpen={openModal}
        toggle={() => setOpenModal(false)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => setOpenModal(false)}>
          <CardTitle tag="h4">Setup Authenticator App</CardTitle>
        </ModalHeader>
        <ModalBody>
          <div className="text-center mb-4">
            <h5>Step 1: Scan QR Code</h5>
            <p className="text-muted">
              Using an authenticator app like Google Authenticator, Microsoft
              Authenticator, Authy, or 1Password, scan the QR code below.
            </p>
          </div>

          <div className="text-center mb-4">
            {qrCodeData ? (
              <img
                src={`data:image/png;base64,${qrCodeData}`}
                alt="QR Code for 2FA Setup"
                style={{
                  maxWidth: '200px',
                  margin: '20px auto',
                  display: 'block',
                  border: '1px solid #ddd',
                  padding: '10px',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>

          <div className="text-center">
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
              disabled={!qrCodeData}
            >
              I've Scanned the Code
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Second Modal - OTP Verification */}
      <Modal
        isOpen={secondModal}
        toggle={() => setSecondModal(false)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setSecondModal(false)}>
          <CardTitle tag="h4">Verify Setup</CardTitle>
        </ModalHeader>
        <ModalBody>
          <div className="text-center mb-4">
            <h5>Step 2: Enter Verification Code</h5>
            <p className="text-muted">
              Enter the 6-digit code generated by your authenticator app to
              complete the setup.
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="12" className="mb-3">
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: 'OTP is required',
                    pattern: {
                      value: /^\d{6}$/, // Only 6 digits
                      message: 'OTP must be exactly 6 digits',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      invalid={!!errors.otp}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center"
                      style={{ fontSize: '18px', letterSpacing: '4px' }}
                    />
                  )}
                />
                {errors.otp && (
                  <FormFeedback>{errors.otp.message}</FormFeedback>
                )}
              </Col>
            </Row>

            <div className="text-center">
              <Button
                className="me-2"
                color="secondary"
                type="button"
                onClick={() => {
                  setSecondModal(false)
                  reset()
                }}
              >
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Verify & Enable
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AccountSecurity
