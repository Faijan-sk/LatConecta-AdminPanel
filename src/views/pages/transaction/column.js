import { Edit } from 'react-feather'

export const columns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '200px',
    selector: (row) => row.full_name,
  },
  {
    name: 'Position',
    sortable: true,
    minWidth: '250px',
    selector: (row) => row.post,
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '250px',
    selector: (row) => row.email,
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '150px',
    selector: (row) => row.start_date,
  },
  {
    name: 'Salary',
    sortable: true,
    minWidth: '150px',
    selector: (row) => row.salary,
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: () => {
      return (
        <div className="d-flex">
          <Edit size={15} />
        </div>
      )
    },
  },
]

export const transactionsListColumn = [
  {
    name: 'Date',
    selector: (row) => row.DATETIME,
    sortable: true,
  },
  {
    name: 'Time',
    selector: (row) => row.DATETIME, // Adjust if time is separate
    sortable: true,
  },
  {
    name: 'Store',
    selector: (row) => row.DISTRIBUTOR,
    sortable: true,
  },
  {
    name: 'Vendor',
    selector: (row) => row.VENDOR,
    sortable: true,
  },
  {
    name: 'MSISDN',
    selector: (row) => row.MSISDN,
    sortable: true,
  },
  {
    name: 'Status',
    selector: (row) => row.STATUS,
    sortable: true,
  },
  {
    name: 'Transaction ID',
    selector: (row) => row.TRANSACTION_ID,
    sortable: true,
  },
  {
    name: 'Vendor Txn ID',
    selector: (row) => row.VENDOR_TRANSACTION_ID,
    sortable: true,
  },
  {
    name: 'Vendor Resp Code',
    selector: (row) => row.VENDOR_RESPONSE_CODE,
    sortable: true,
  },
  {
    name: 'Vendor Resp Msg',
    selector: (row) => row.VENDOR_RESPONSE_MESSAGE,
    sortable: true,
  },
  {
    name: 'Client Txn ID',
    selector: (row) => row.CLIENT_TRANSACTION_ID,
    sortable: true,
  },
  {
    name: 'Resp Code',
    selector: (row) => row.RESPONSE_CODE,
    sortable: true,
  },
  {
    name: 'Resp Message',
    selector: (row) => row.RESPONSE_MESSAGE,
    sortable: true,
  },
  {
    name: 'Product',
    selector: (row) => row.PRODUCT,
    sortable: true,
  },
  {
    name: 'Product Type',
    selector: (row) => row.PRODUCT_TYPE,
    sortable: true,
  },
  {
    name: 'Amount',
    selector: (row) => row.AMOUNT,
    sortable: true,
  },
  {
    name: 'Product Currency',
    selector: (row) => row.PRODUCT_CURRENCY,
    sortable: true,
  },
  {
    name: 'FX Margin',
    selector: (row) => row.FX_MARGIN,
    sortable: true,
  },
  {
    name: 'Tax',
    selector: (row) => row.TAX,
    sortable: true,
  },
  {
    name: 'Commission',
    selector: (row) => row.COMISSION,
    sortable: true,
  },
  {
    name: 'User Currency',
    selector: (row) => row.USER_CURRENCY,
    sortable: true,
  },
  {
    name: 'Converted Amount',
    selector: (row) => row.CONVERTED_AMOUNT,
    sortable: true,
  },
  {
    name: 'Vendor Currency',
    selector: (row) => row.VENDOR_CURRENCY,
    sortable: true,
  },
  {
    name: 'Conversion Rate',
    selector: (row) => row.CONVERSION_RATE,
    sortable: true,
  },
  {
    name: 'Admin Commission',
    selector: (row) => row.ADMIN_COMISSION,
    sortable: true,
  },
  {
    name: 'Country',
    selector: (row) => row.COUNTRY,
    sortable: true,
  },
  {
    name: 'O-B-D-W',
    selector: (row) => row.OPENING_BALANCE,
    sortable: true,
  },
  {
    name: 'C-B-D-W',
    selector: (row) => row.CLOSING_BALANCE,
    sortable: true,
  },
  {
    name: 'O-B-A-W',
    selector: (row) => row.OPENING_BALANCE_ADMIN_WALLET,
    sortable: true,
  },
  {
    name: 'C-B-A-W',
    selector: (row) => row.CLOSING_BALANCE_ADMIN_WALLET,
    sortable: true,
  },
  {
    name: 'O-B-A-CM',
    selector: (row) => row.OPENING_BALANCE_ADMIN_CM,
    sortable: true,
  },
  {
    name: 'C-B-A-CM',
    selector: (row) => row.CLOSING_BALANCE_ADMIN_CM,
    sortable: true,
  },
  {
    name: 'O-B-FX',
    selector: (row) => row.OPENING_BALANCE_FX,
    sortable: true,
  },
  {
    name: 'C-B-FX',
    selector: (row) => row.CLOSING_BALANCE_FX,
    sortable: true,
  },
  {
    name: 'O-B-TX',
    selector: (row) => row.OPENING_BALANCE_TX,
    sortable: true,
  },
  {
    name: 'C-B-TX',
    selector: (row) => row.CLOSING_BALANCE_TX,
    sortable: true,
  },
]
