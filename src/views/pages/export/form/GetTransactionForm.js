import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Row,
  Col,
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import useJwt from '@src/auth/jwt/useJwt'

const UserForm = ({ setFilterData, limit, offset }) => {
  const [vendor, setVendor] = useState([])
  const [exporting, setExporting] = useState('Export')
  const [stores, setStore] = useState([])
  const [transactions, setTransactions] = useState({
    count: 0,
    results: [],
  })
  const [exportFormat, setExportFormat] = useState('')
  const [searchParams, setSearchParams] = useState({})

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      vn: '',
      store: '',
      created_at__gte: '',
      created_at__lte: '',
      status: '',
      msisdn: '',
    },
  })

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

    const fetchStore = async () => {
      try {
        const res = await useJwt.getStores()
        setStore(res.data)
      } catch (err) {
        toast.error('Failed to fetch Store')
        console.error(err)
      }
    }

    fetchVendors()
    fetchStore()
  }, [])

  const onSubmit = async (data) => {
    setExporting('Exporting...')
    try {
      const processedData = { ...data }

      if (processedData.vn) {
        const selectedVendor = vendor.find(
          ({ uid }) => uid === processedData.vn
        )
        if (selectedVendor) {
          processedData['vendor__first_name'] =
            selectedVendor.first_name || null
          processedData['vendor__last_name'] = selectedVendor.last_name || null
        }
        delete processedData.vn
      }

      if (processedData.store) {
        const selectedStore = stores.find(
          ({ uid }) => uid === processedData.store
        )
        if (selectedStore) {
          processedData['distributor__first_name'] =
            selectedStore.first_name || null
          processedData['distributor__last_name'] =
            selectedStore.last_name || null
        }
        delete processedData.store
      }

      setSearchParams(processedData)

      const params = new URLSearchParams()
      Object.keys(processedData).forEach((key) => {
        if (processedData[key]) params.append(key, processedData[key])
      })

      const { data: transactionData } = await useJwt.getfilterTransaction(
        `?limit=${limit}&${params}`
      )
      setTransactions(transactionData)

      toast.success('Transactions fetched successfully!')
    } catch (error) {
      toast.error('Transaction fetch failed.')
      console.error(error)
    }
  }

  const handleExport = async () => {
    if (!exportFormat) {
      toast.error('Please select an export format.')
      return
    }

    setExporting('Exporting...')

    const formData = getValues()
    const processedData = { ...formData }

    if (processedData.vn) {
      const selectedVendor = vendor.find(({ uid }) => uid === processedData.vn)
      if (selectedVendor) {
        processedData['vendor__first_name'] = selectedVendor.first_name || null
        processedData['vendor__last_name'] = selectedVendor.last_name || null
      }
      delete processedData.vn
    }

    if (processedData.store) {
      const selectedStore = stores.find(
        ({ uid }) => uid === processedData.store
      )
      if (selectedStore) {
        processedData['distributor__first_name'] =
          selectedStore.first_name || null
        processedData['distributor__last_name'] =
          selectedStore.last_name || null
      }
      delete processedData.store
    }

    const params = new URLSearchParams()
    Object.keys(processedData).forEach((key) => {
      if (processedData[key]) params.append(key, processedData[key])
    })

    try {
      toast.loading('Checking data availability...')
      const { data } = await useJwt.getfilterTransaction(
        `?limit=100000&${params}`
      )
      toast.dismiss()

      if (data.results.length === 0) {
        const isFilterApplied = Object.values(formData).some((val) => val)
        if (isFilterApplied) {
          toast.error('No records found for the selected filters.')
        } else {
          toast.error('No data to export.')
        }
        return
      }

      // Proceed with export
      if (exportFormat === '1') {
        exportToExcel(data.results)
      } else if (exportFormat === '2') {
        exportToCSV(data.results)
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to fetch transactions for export')
      console.error(error)
    }
  }

  const exportToCSV = (data) => {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', 'transactions_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('CSV export successful!')
  }

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
    XLSX.writeFile(workbook, 'transactions_export.xlsx')

    toast.success('Excel export successful!')
    setExporting('Export')
  }

  const status = [
    { uid: '1', value: 'Success' },
    { uid: '2', value: 'Fail' },
  ]

  const format = [
    { uid: '1', value: 'EXCEL' },
    { uid: '2', value: 'CSV' },
  ]

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm="6" md="2" className="mb-2">
          <Label>Vendor</Label>
          <Controller
            name="vn"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.vn}>
                <option value="">Select Vendor</option>
                {vendor.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.vn?.message}</FormFeedback>
        </Col>

        <Col sm="6" md="2" className="mb-2">
          <Label>Stores</Label>
          <Controller
            name="store"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.store}>
                <option value="">Select Store</option>
                {stores.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.first_name} {item.last_name}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.store?.message}</FormFeedback>
        </Col>

        <Col sm="6" md="2" className="mb-2">
          <Label>Transaction From</Label>
          <Controller
            name="created_at__gte"
            control={control}
            render={({ field }) => (
              <Flatpickr
                id="from-picker"
                className="form-control"
                {...field}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }}
              />
            )}
          />
        </Col>

        <Col sm="6" md="2" className="mb-2">
          <Label>Transaction To</Label>
          <Controller
            name="created_at__lte"
            control={control}
            render={({ field }) => (
              <Flatpickr
                id="to-picker"
                className="form-control"
                {...field}
                options={{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }}
              />
            )}
          />
        </Col>

        <Col sm="12" md="2" className="mb-2">
          <Label>Transaction Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Input type="select" {...field} invalid={!!errors.status}>
                <option value="">Select Status</option>
                {status.map((item) => (
                  <option key={item.uid} value={item.uid}>
                    {item.value}
                  </option>
                ))}
              </Input>
            )}
          />
          <FormFeedback>{errors.status?.message}</FormFeedback>
        </Col>

        <Col sm="12" md="2" className="mb-2">
          <Label>MSISDN</Label>
          <Controller
            name="msisdn"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Enter MSISDN" {...field} />
            )}
          />
        </Col>

        <Col sm="12" md="2" className="mb-2">
          <Label>
            Export Format <span className="text-danger">*</span>
          </Label>
          <Input
            type="select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            required
            invalid={exportFormat === ''}
          >
            <option value="">Select Format</option>
            {format.map((item) => (
              <option key={item.uid} value={item.uid}>
                {item.value}
              </option>
            ))}
          </Input>
          {exportFormat === '' && (
            <div className="text-danger mt-1">Export Format is required.</div>
          )}
        </Col>

        <div className="d-flex justify-content-end p-1 gap-3">
          <Button
            color="secondary"
            type="button"
            onClick={handleExport}
            className="ml-2 me-2"
          >
            {exporting}
          </Button>
        </div>
      </Row>
    </Form>
  )
}

export default UserForm
