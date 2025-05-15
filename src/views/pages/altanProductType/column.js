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
