// ** Auth Endpoints
export default {
  loginEndpoint: '/api/lgn/',
  vendorEndPoint: '/api/vnr/',
  currencyEndPoint: '/api/cu/',
  altanProductEndPoint: '/api/app/',
  getaltanProductEndPoint: 'api/ap/',
  productEndPoint: '/api/pp/',
  skuidEndPoint: '/api/mvsku/',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',
  storeEndPoint: '/api/dm/',
  balanceEndPoint: '/api/bln',
  BankCommissionEndPoint: '/api/admp',
  balanceByMonth: '/api/aab/',
  transactionEndPoint: '/api/tr/',
  detailedBalance: '/api/gddb?search=',
  reasonEndPoint: 'api/rsn/',
  addBalanceEndpoint: 'api/bm/',
  generateQrAuthenticatorEndPoint: 'api/vbab',
  verifyOtpforBarcode: 'api/verifyotp',
  check2FAStatus: 'api/verify2fa',
  desableAuthenticator: '/api/disable2fa',
  dashboardStasticsEndPoint: '/api/st/',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
