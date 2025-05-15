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

import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = ({ editRow }) => {
  const [stores, setStores] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await useJwt.getStores()
        setStores(res.data)
      } catch (err) {
        toast.error('Failed to fetch Store')
        console.error(err)
      }
    }
    fetchStores()
  }, [])

  const confirmDelete = (store) => {
    setSelectedStore(store)
    setModalOpen(true)
  }

  const handleConfirmedDelete = async () => {
    try {
      await useJwt.deleteStore(selectedStore.uid)
      toast.success('Store deleted successfully')
      setStores((prev) => prev.filter((s) => s.uid !== selectedStore.uid))
    } catch (err) {
      toast.error('Failed to delete store')
      console.error(err)
    } finally {
      setModalOpen(false)
      setSelectedStore(null)
    }
  }

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((item, index) => (
            <tr key={item.id || index}>
              <td>{item.username}</td>
              <td>
                <span className="align-middle fw-bold">{item.first_name}</span>
              </td>
              <td>{item.last_name}</td>
              <td>{item.mobile}</td>
              <td>{item.email}</td>
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
                      onClick={() => editRow('open', item)}
                      className="w-100 d-block"
                    >
                      <Edit className="me-50" size={15} />
                      <span className="align-middle">Edit</span>
                    </DropdownItem>
                    <DropdownItem
                      onClick={(e) => {
                        e.preventDefault()
                        confirmDelete(item)
                      }}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => setModalOpen(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete{' '}
          <strong>
            {selectedStore?.first_name} {selectedStore?.last_name}
          </strong>
          ?
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
