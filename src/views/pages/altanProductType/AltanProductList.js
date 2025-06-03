import React, { useState, useEffect, useRef } from 'react'
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
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = ({ editRow }) => {
  const [products, setProducts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const intervalRef = useRef(null)

  // Fetch products function
  const fetchAltanProduct = async (showToast = false) => {
    try {
      setIsLoading(true)
      const res = await useJwt.getAltanProduct()
      const newData = res.data

      setProducts((prevProducts) => {
        if (JSON.stringify(prevProducts) !== JSON.stringify(newData)) {
          if (showToast && prevProducts.length > 0) {
            toast.success('Data updated!')
          }
          return newData
        }
        return prevProducts
      })
    } catch (err) {
      toast.error('Failed to fetch Product')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 🔧 Removed redundant call: fetchAltanProduct was called twice
    fetchAltanProduct()
    intervalRef.current = setInterval(() => {
      fetchAltanProduct(true) // Show toast on updates
    }, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAltanProduct(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const confirmDelete = (product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  const handleConfirmedDelete = async () => {
    try {
      await useJwt.deleteProduct(selectedProduct.uid)
      toast.success('Product deleted successfully')
      setProducts((prev) => prev.filter((v) => v.id !== selectedProduct.id))

      // Optional: delay refresh for UX
      setTimeout(() => {
        fetchAltanProduct()
      }, 1000)
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
      {products && products.length > 0 ? ( // 🔧 Added length check to avoid rendering empty table
        <Table responsive>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                <td>
                  <span className="align-middle fw-bold">{item.name}</span>
                </td>
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
                        onClick={() => editRow('open', item)}
                        className="w-100 d-block"
                      >
                        <Edit className="me-50" size={15} />
                        <span className="align-middle">Edit</span>
                      </DropdownItem>
                      <DropdownItem
                        type="button"
                        onClick={() => confirmDelete(item)}
                        className="w-100 d-block"
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
      ) : (
        <p className="text-center">There are no records to display</p>
      )}

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
          {/* 🔧 Fixed name reference for product */}
          Are you sure you want to delete{' '}
          <strong>{selectedProduct?.name}</strong>? This action cannot be
          undone.
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
