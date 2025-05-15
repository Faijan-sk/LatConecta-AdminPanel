import React, { useState, useEffect } from 'react'
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'
import {
  Table,
  Badge,
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
  const [vendor, setVendor] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await useJwt.getVendor()
        setVendor(res.data)
      } catch (err) {
        toast.error('Failed to fetch Vendor')
        console.error(err)
      }
    }
    fetchVendors()
  }, [])

  const confirmDelete = (vendor) => {
    setSelectedVendor(vendor)
    setModalOpen(true)  
  }

  const handleConfirmedDelete = async () => {
    try {
      await useJwt.deleteVendor(selectedVendor.uid)
      toast.success('Vendor deleted successfully')
      setVendor((prev) => prev.filter((v) => v.id !== selectedVendor.id))
    } catch (err) {
      toast.error('Failed to delete vendor')
      console.error(err)
    } finally {
      setModalOpen(false)
      setSelectedVendor(null)
    }
  }

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>id</th>
            <th>User</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendor.map((item, index) => (
            <tr key={item.id || index}>
              <td>{index + 1}</td>
              <td>
                <span className="align-middle fw-bold">
                  {item.first_name} {item.last_name}
                </span>
              </td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>
                <Badge pill color="light-primary" className="me-1">
                  Active
                </Badge>
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
          Are you sure you want to delete{' '}
          <strong>
            {selectedVendor?.first_name} {selectedVendor?.last_name}
          </strong>
          ? This action cannot be undone.
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
