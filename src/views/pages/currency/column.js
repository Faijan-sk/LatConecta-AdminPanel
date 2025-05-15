import { Edit } from 'react-feather'

export const columns = [
  {
    name: 'Currency Name',
    sortable: true,
    minWidth: '200px',
    selector: (row) => row.full_name,
  },
  {
    name: 'Prefix',
    sortable: true,
    minWidth: '250px',
    selector: (row) => row.post,
  },

  {
    name: 'Date',
    sortable: true,
    minWidth: '150px',
    selector: (row) => row.start_date,
  },
]
