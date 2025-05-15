import React, { useState, useEffect } from 'react'
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
import { MoreVertical, Edit, Trash } from 'react-feather'
import toast from 'react-hot-toast'

// ** import service
import useJwt from '@src/auth/jwt/useJwt'

const TableBasic = ({ editRow }) => {
  const [currencies, setCurrencies] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(null)

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await useJwt.getCurrency()
        setCurrencies(res.data)
      } catch (err) {
        toast.error('Failed to fetch currencies')
        console.error(err)
      }
    }

    fetchCurrencies()
  }, [])

  const confirmDelete = (currency) => {
    setSelectedCurrency(currency)
    setModalOpen(true)
  }

  const handleConfirmedDelete = async () => {
    try {
      await useJwt.deleteCurrency(selectedCurrency.uid)
      toast.success('Currency deleted successfully')
      setCurrencies((prev) => prev.filter((c) => c.id !== selectedCurrency.id))
    } catch (err) {
      toast.error('Failed to delete currency')
      console.error(err)
    } finally {
      setModalOpen(false)
      setSelectedCurrency(null)
    }
  }

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Prefix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((item, index) => (
            <tr key={item.id || index}>
              <td>{index + 1}</td>
              <td>
                <span className="align-middle fw-bold">{item.name}</span>
              </td>
              <td>{item.prefix}</td>
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
          Are you sure you want to delete currency{' '}
          <strong>{selectedCurrency?.name}</strong>? This action cannot be
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
