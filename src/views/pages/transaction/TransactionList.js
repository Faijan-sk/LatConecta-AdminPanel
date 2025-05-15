// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Row,
  Col,
  CardBody,
} from 'reactstrap'
import { transactionsListColumn } from './column'

// ** Filter List Form
import TransactionForm from './form/GetTransactionForm'

// ** Jwt Class
import useJwt from '@src/auth/jwt/useJwt'
import toast from 'react-hot-toast'

const TransactionList = () => {
  // ** State
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [offset, setOffset] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filterData, setFilterData] = useState({
    count: 0,
    results: [],
  })
  const [tableData, setTableData] = useState({
    count: 0,
    results: [],
  })

  const renderData = () => {
    if (filterData?.count) {
      return filterData
    } else return tableData
  }

  // ** Fetch List
  async function fetchData(limit = 10, offset = 0) {
    try {
      const { data } = await useJwt.getTransactin(limit, offset)
      setTableData({ ...data })
    } catch (error) {
      toast.error('Server not working!')
    } finally {
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    // **
    debugger
    const { selected } = page
    const l = rowsPerPage
    const o = selected * l

    fetchData(l, o)
    setOffset(o)
    setCurrentPage(selected + 1)
  }
  // ** Function to handle per page
  const handlePerPage = (e) => {}

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Math.ceil(renderData().count / rowsPerPage)

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
        <CardBody>
          <TransactionForm
            limit={rowsPerPage}
            offset={offset}
            setFilterData={setFilterData}
          />
        </CardBody>
      </Card>
      <div className="react-dataTable">
        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={transactionsListColumn}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={renderData().results}
        />
      </div>
    </Fragment>
  )
}

export default TransactionList
