import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

// axios.defaults.baseURL = 'https://bumip.mitopup.com/'
axios.defaults.baseURL = 'http://192.168.29.200:8001/'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (window.location.pathname !== '/login') {
            localStorage.removeItem('userData')
            window.location.href = '/login'
          }
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axios(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    )
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    console.log(args)
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    })
  }

  // vendorEndPoint
  addVendor(data) {
    return axios.post(this.jwtConfig.vendorEndPoint, data)
  }
  editVendor(uid, data) {
    return axios.put(`${this.jwtConfig.vendorEndPoint}${uid}`, data)
  }

  getVendor() {
    return axios.get(this.jwtConfig.vendorEndPoint)
  }

  deleteVendor(uid) {
    return axios.delete(`${this.jwtConfig.vendorEndPoint}${uid}`)
  }

  //** Currency  */
  addCurrency(data) {
    return axios.post(this.jwtConfig.currencyEndPoint, data)
  }
  getCurrency() {
    return axios.get(this.jwtConfig.currencyEndPoint)
  }

  editCurreency(uid, data) {
    return axios.put(`${this.jwtConfig.currencyEndPoint}${uid}`, data)
  }

  deleteCurrency(uid) {
    return axios.delete(`${this.jwtConfig.currencyEndPoint}${uid}`)
  }

  //** product */
  addProduct(data) {
    return axios.post(this.jwtConfig.productEndPoint, data)
  }

  addAltanProduct(data) {
    return axios.post(this.jwtConfig.altanProductEndPoint, data)
  }

  getProduct() {
    return axios.get(this.jwtConfig.productEndPoint)
  }

  editProduct(uid, data) {
    return axios.put(`${this.jwtConfig.productEndPoint}${uid}`, data)
  }

  deleteProduct(uid) {
    return axios.delete(`${this.jwtConfig.productEndPoint}${uid}`)
  }

  //** skuid  */
  getSkuid() {
    return axios.get(this.jwtConfig.skuidEndPoint)
  }

  addSkuid(data) {
    return axios.post(this.jwtConfig.skuidEndPoint, data)
  }
  //** Store */
  getStores() {
    return axios.get(this.jwtConfig.storeEndPoint)
  }
  addStores(...args) {
    return axios.post(this.jwtConfig.storeEndPoint, ...args)
  }
  deleteStore(uid) {
    return axios.delete(`${this.jwtConfig.storeEndPoint}${uid}`)
  }

  editStore(uid, data) {
    return axios.put(`${this.jwtConfig.storeEndPoint}${uid}`, data)
  }

  //** Balance Detail */

  getBalance() {
    return axios.get(this.jwtConfig.balanceEndPoint)
  }

  addBalance(...args) {
    return axios.post(this.jwtConfig.addBalanceEndpoint, ...args)
  }

  getDetailedBalance(uid) {
    return axios.get(`${this.jwtConfig.detailedBalance}${uid}`)
  }
  getMonthBalance(month) {
    return axios.get(`${this.jwtConfig.balanceEndPoint}?month=${month}`)
  }

  getBankCommissions() {
    return axios.get(this.jwtConfig.BankCommissionEndPoint)
  }

  //** transaction Report */
  getTransactin(limit = 0, offset = 0) {
    return axios.get(
      `${this.jwtConfig.transactionEndPoint}?limit=${limit}&offset=${offset}`
    )
  }
  getfilterTransaction(params) {
    return axios.get(`${this.jwtConfig.transactionEndPoint}${params}`)
  }

  // get reason for balanve
  getReason() {
    return axios.get(this.jwtConfig.reasonEndPoint)
  }
  getQr() {
    return axios.post(this.jwtConfig.generateQrAuthenticatorEndPoint)
  }
  verifyOtp(...args) {
    return axios.post(this.jwtConfig.verifyOtpforBarcode, ...args)
  }
  check2FAStatus() {
    return axios.get(this.jwtConfig.check2FAStatus)
  }
  desableAuthentication() {
    return axios.post(this.jwtConfig.desableAuthenticator)
  }
}
