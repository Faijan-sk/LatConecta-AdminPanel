import { lazy } from 'react'

const VendorManagement = lazy(() => import('../../views/pages/vendor'))
const CurrencyManagement = lazy(() => import('../../views/pages/currency'))
const ProductManagement = lazy(() => import('../../views/pages/product'))
const TransactionReport = lazy(() => import('../../views/pages/transaction'))
const StoreManagement = lazy(() => import('../../views/pages/Store'))
const AltanProduct = lazy(() => import('../../views/pages/altanProductType'))
const BalanceList = lazy(() => import('../../views/pages/balance'))
const Export = lazy(() => import('../../views/pages/export'))
const BalanceDetail = lazy(() =>
  import('../../views/pages/balance/BalanceDetail')
)
export default [
  {
    path: '/vendor/list',
    element: <VendorManagement />,
  },
  {
    path: '/currency/list',
    element: <CurrencyManagement />,
  },
  {
    path: '/product/list',
    element: <ProductManagement />,
  },
  {
    path: '/transaction/list',
    element: <TransactionReport />,
  },
  {
    path: '/export',
    element: <Export />,
  },
  {
    path: '/altanProduct/list',

    element: <AltanProduct />,
  },
  {
    path: '/store/list',
    element: <StoreManagement />,
  },
  {
    path: '/balance/list',
    element: <BalanceList />,
  },
  {
    path: '/balance-detail/:uid',
    element: <BalanceDetail />,
  },
]
