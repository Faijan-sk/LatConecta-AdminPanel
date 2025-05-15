import {
  DollarSign,
  Users,
  Home,
  Codepen,
  Printer,
  Database,
} from 'react-feather'

export default [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Home size={12} />,

    // action: 'read',
    // resource: 'ACL',
    navLink: '/dashboard/ecommerce',
  },
  {
    id: 'vender-management',
    title: 'Vendor',
    icon: <Users size={12} />,

    // action: 'read',
    // resource: 'ACL',
    navLink: '/vendor/list',
  },
  {
    id: 'currency-management',
    title: 'Currency',
    icon: <DollarSign size={12} />,
    navLink: 'currency/list',
  },
  {
    id: 'Product-management',
    title: 'Product',
    icon: <Codepen size={12} />,
    navLink: 'product/list',
  },
  {
    id: 'product-Altan',
    title: 'Altan Product Type',
    icon: <Codepen size={12} />,
    navLink: 'altanProduct/list',
  },
  {
    id: 'Store-management',
    title: 'Store',
    icon: <Home size={12} />,
    navLink: 'store/list',
  },
  {
    id: 'Balance',
    title: 'Balance',
    icon: <Database size={12} />,
    navLink: 'balance/list',
  },
  {
    id: 'User-management',
    title: 'User Management',
    icon: <Users size={12} />,
    navLink: '',
  },
  {
    id: 'Transaction-Report',
    title: 'Transaction Report',
    icon: <Printer size={12} />,
    navLink: 'transaction/list',
  },
  {
    id: 'Export',
    title: 'Export',
    icon: <Printer size={12} />,
    navLink: 'export',
  },
]
