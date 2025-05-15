// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import ProductList from './ProductList'

// ** Form
import PlanForm from './form/AddPlanForm'
import TopUpForm from './form/AddTopUpForm'

//** From Selection Tab */
import FormSelection from './FormSelection'
import AddSkuidForm from './form/AddSkuid'

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

const VendorTable = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [openModal, setOpenModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [formType, setFormType] = useState(null) // 'product' or 'skuid'

  const [tableData, setTableData] = useState({
    results: [],
    count: 0,
  })

  // ** Toggle Modal
  const toggle = (action = 'close', edtData = null, type = null) => {
    if (action === 'open') {
      setOpenModal(true)
      setEditData(edtData)
      setFormType(type)
    } else {
      setOpenModal(false)
      setEditData(null)
      setFormType(null)
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
          <CardTitle tag="h4">Products</CardTitle>
        </CardHeader>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          {/* <div className="d-flex justify-content-end p-1">
            <Button color={'primary'}>View Skuid</Button>
          </div> */}
          <div className="d-flex justify-content-end p-1">
            <Button
              color={'primary'}
              onClick={() => toggle('open', null, 'skuid')}
            >
              Add Skuid
            </Button>
          </div>
          <div className="d-flex justify-content-end p-1">
            <Button
              color={'primary'}
              onClick={() => toggle('open', null, 'product')}
            >
              Add Product
            </Button>
          </div>
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
          <ProductList editRow={toggle} />
        </div>
      </Card>

      <Modal
        isOpen={openModal}
        toggle={() => toggle('close')}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={() => toggle('close')}>
          <CardTitle>
            {editData
              ? 'Edit Product'
              : formType === 'skuid'
              ? 'Add Skuid'
              : 'Add New Product'}
          </CardTitle>
        </ModalHeader>
        <ModalBody>
          {console.log({ formType })}
          {formType === 'skuid' && <AddSkuidForm />}
          {formType === 'product' && <FormSelection formData={editData} />}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default memo(VendorTable)
