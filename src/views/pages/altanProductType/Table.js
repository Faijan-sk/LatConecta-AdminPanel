// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import AltanProductList from './AltanProductList'

// ** Form
import AltanProductForm from './form/AltanProductForm'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap'

// ** Table Column

import { columns } from './column'

const AltanTable = () => {

  // ** Store Vars
  //   const dispatch = useDispatch()
  //   const store = useSelector((state) => state.dataTables)

  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)

  const [tableData, setTableData] = useState({
    results: [],
    count: 0,
  })

  // ** ToggleModal,
  const toggle = (action = 'close', edtData = null) => {
    if (action == 'open') {
      setOpenModal(true)
      setEditData(edtData)
    } else {
      setOpenModal(false)
      setEditData(edtData)
    }
  }

  // ** Get data on mount
  useEffect(() => {}, [])

  // ** Function to handle filter
  const handleFilter = (e) => {}

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {}

  // ** Function to handle per page
  const handlePerPage = (e) => {}

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(tableData.count / rowsPerPage)

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
        onPageChange={(page) => handlePagination(page)}
        pageClassName="page-item"
        breakClassName="page-item"
        nextLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextClassName="page-item next-item"
        previousClassName="page-item prev-item"
        containerClassName={
          'pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        }
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Altan Product</CardTitle>
        </CardHeader>

        <div className="d-flex justify-content-end p-1">
          <Button color={'primary'} onClick={() => toggle('open')}>
            Add Altan Product
          </Button>
        </div>

        <div className="react-dataTable m-2">
          {/* <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={tableData.results}
          /> */} 
          <AltanProductList />
        </div>
      </Card>

      <Modal
        isOpen={openModal}
        toggle={() => toggle('close')}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader>
          <CardTitle>{editData ? 'Edit Prodcut' : 'Add New Product'}</CardTitle>
        </ModalHeader>
        <ModalBody>
          <AltanProductForm formData={editData} />
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default memo(AltanTable)
