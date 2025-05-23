import { Fragment, useState, useEffect, memo } from 'react'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap'

import CurrencyList from './CurrencyList'
import { columns } from './column'
import AddCurrencyForm from './form/CurrencyForm'

const CurrencyTable = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [refreshFlag, setRefreshFlag] = useState(false) // <-- for refreshing

  const toggle = (action = 'close', edtData = null) => {
    if (action === 'open') {
      setOpenModal(true)
      setEditData(edtData)
    } else {
      setOpenModal(false)
      setEditData(null)
    }
  }

  const triggerRefresh = () => {
    setRefreshFlag((prev) => !prev) // toggles value
  }

  const CustomPagination = () => {
    const count = Math.ceil(0 / rowsPerPage) // Replace with actual count if needed
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={Math.ceil(count) || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => {}}
        pageClassName="page-item"
        breakClassName="page-item"
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextClassName="page-item next-item"
        previousClassName="page-item prev-item"
        containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Currency</CardTitle>
        </CardHeader>
        <div className="d-flex justify-content-end p-1">
          <Button color="primary" onClick={() => toggle('open')}>
            Add Currency
          </Button>
        </div>
        <div className="react-dataTable m-2">
          <CurrencyList editRow={toggle} refresh={refreshFlag} />
        </div>
      </Card>

      <Modal
        isOpen={openModal}
        toggle={() => toggle('close')}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader>
          <CardTitle>
            {editData ? 'Edit Currency' : 'Add New Currency'}
          </CardTitle>
        </ModalHeader>
        <ModalBody>
          <AddCurrencyForm
            formData={editData}
            onSuccess={() => {
              toggle('close') // close modal after success
              triggerRefresh() // refresh list
            }}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default memo(CurrencyTable)
