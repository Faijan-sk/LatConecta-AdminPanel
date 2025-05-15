import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
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
} from 'reactstrap'

// ** import service
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = ({ editRow }) => {
  const [products, setProducts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await useJwt.getProduct()
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
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
    } catch (err) {
      toast.error('Failed to delete product')
      console.error(err)
    } finally {
      setModalOpen(false)
      setSelectedProduct(null)
    }
  }

  return (
    <>
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
                      onClick={() => editRow('open', item)}
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
