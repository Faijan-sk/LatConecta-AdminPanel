import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

import {
  Table,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from 'reactstrap'

// ** import service
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = ({ editRow }) => {
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await useJwt.getProduct()
        setAllProducts(res.data)
        setProducts(res.data)
      } catch (err) {
        toast.error('Failed to fetch Product')
        console.error(err)
      }
    }
    fetchProduct()
  }, [])

  const productTypeMap = {
    1: 'Plan(Bundle)',
    2: 'TopUp',
  }

  const confirmDelete = (product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleConfirmedDelete = async () => {
    try {
      await useJwt.deleteProduct(selectedProduct.uid)
      toast.success('Product deleted successfully')
      setAllProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
    } catch (err) {
      toast.error('Failed to delete product')
      console.error(err)
    } finally {
      setModalOpen(false)
      setSelectedProduct(null)
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      vn_name: '',
      pdn: '',
      Skuid: '',
      pcrn: '',
    },
  })

  const watchFields = watch()

  useEffect(() => {
    const filtered = allProducts.filter((item) => {
      const vnMatch = item.vn_name
        ?.toLowerCase()
        .includes(watchFields.vn_name?.toLowerCase() || '')
      const pdnMatch = item.pdn
        ?.toLowerCase()
        .includes(watchFields.pdn?.toLowerCase() || '')
      const skuidMatch = item.Skuid?.toLowerCase().includes(
        watchFields.Skuid?.toLowerCase() || ''
      )
      const pcrnMatch = item.pcrn
        ?.toLowerCase()
        .includes(watchFields.pcrn?.toLowerCase() || '')

      return vnMatch && pdnMatch && skuidMatch && pcrnMatch
    })
    setProducts(filtered)
  }, [watchFields, allProducts])

  const onSubmit = async (data) => {
    // Not used here but required by useForm
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="12" md="3" className="mb-3">
            <Label>Vendor Name</Label>
            <Controller
              name="vn_name"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Only letters and spaces are allowed',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  invalid={!!errors.vn_name}
                  placeholder="Enter Vendor Name"
                  onKeyDown={(e) => {
                    const regex = /^[A-Za-z\s]*$/
                    if (
                      !regex.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Tab' &&
                      e.key !== 'ArrowLeft' &&
                      e.key !== 'ArrowRight'
                    ) {
                      e.preventDefault()
                    }
                  }}
                />
              )}
            />
            <FormFeedback>{errors.vn_name?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="3" className="mb-3">
            <Label>Product Name</Label>
            <Controller
              name="pdn"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9_]+$/,
                  message:
                    'Only uppercase letters, numbers, and underscore (_) are allowed',
                },
              }}
              render={({ field: { onChange, value, ...restField } }) => (
                <Input
                  {...restField}
                  value={value?.toUpperCase().replace(/[^A-Z0-9_]/g, '') || ''}
                  type="text"
                  invalid={!!errors.pdn}
                  placeholder="Search Product Name"
                  onChange={(e) => {
                    const cleanedValue = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9_]/g, '')
                    onChange(cleanedValue)
                  }}
                />
              )}
            />
            <FormFeedback>{errors.pdn?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="3" className="mb-3">
            <Label>Product SKU :</Label>
            <Controller
              name="Skuid"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: 'Only letters and numbers are allowed',
                },
              }}
              render={({ field: { onChange, value, ...restField } }) => (
                <Input
                  {...restField}
                  value={value?.replace(/[^A-Za-z0-9]/g, '') || ''}
                  type="text"
                  invalid={!!errors.Skuid}
                  placeholder="Enter Skuid"
                  onChange={(e) => {
                    const cleanedValue = e.target.value.replace(
                      /[^A-Za-z0-9]/g,
                      ''
                    )
                    onChange(cleanedValue)
                  }}
                />
              )}
            />
            <FormFeedback>{errors.Skuid?.message}</FormFeedback>
          </Col>

          <Col sm="12" md="3" className="mb-3">
            <Label>Currency</Label>
            <Controller
              name="pcrn"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z]{3}$/,
                  message: 'Currency must be exactly 3 uppercase letters',
                },
                maxLength: {
                  value: 3,
                  message: 'Currency code must be 3 letters',
                },
                minLength: {
                  value: 3,
                  message: 'Currency code must be 3 letters',
                },
              }}
              render={({ field: { onChange, value, ...restField } }) => (
                <Input
                  {...restField}
                  value={value?.toUpperCase().replace(/[^A-Z]/g, '') || ''}
                  type="text"
                  maxLength={3}
                  invalid={!!errors.pcrn}
                  placeholder="Enter Currency"
                  onChange={(e) => {
                    const cleanedValue = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z]/g, '')
                    onChange(cleanedValue)
                  }}
                />
              )}
            />
            <FormFeedback>{errors.pcrn?.message}</FormFeedback>
          </Col>
        </Row>
      </Form>

      <Table responsive>
        <thead>
          <tr>
            <th>Product Category</th>
            <th>Product Type</th>
            <th>Vendor Name</th>
            <th>Product Name</th>
            <th>Alias Name</th>
            <th>Skuid</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>
                {item.product_category === 'A'
                  ? 'Altan Product'
                  : item.product_category === 'N'
                  ? 'Normal Product'
                  : item.product_category}
              </td>
              <td>
                <span className="align-middle fw-bold">
                  {productTypeMap[item.pt] || item.pt}
                </span>
              </td>
              <td>{item.vn_name}</td>
              <td>{item.pdn}</td>
              <td>{item.alias_name}</td>
              <td>{item.Skuid}</td>
              <td>{item.product}</td>
              <td>{item.amt}</td>
              <td>{item.pcrn}</td>
              <td>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="icon-btn hide-arrow"
                    color="transparent"
                    size="sm"
                    caret
                  >
                    <MoreVertical size={15} />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      type="button"
                      className="w-100 d-block"
                      onClick={() => editRow('open', item, 'product')}
                    >
                      <Edit className="me-50" size={15} />
                      <span className="align-middle">Edit</span>
                    </DropdownItem>
                    <DropdownItem
                      type="button"
                      className="w-100 d-block"
                      onClick={() => confirmDelete(item)}
                    >
                      <Trash className="me-50" size={15} />
                      <span className="align-middle">Delete</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        className="modal-dialog-centered"
        modalClassName="modal-danger"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete product{' '}
          <strong>{selectedProduct?.pdn}</strong>? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleConfirmedDelete}>
            Yes, Delete
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default TableBasic
