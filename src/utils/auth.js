import Auth0Lock from 'auth0-lock'

const authDomain = "rabdulsal.auth0.com"
const clientID = "e2vPYhkqfEsuvWD2VSJQPUmW19BCJbK9"

class AuthService {
  constructor() {
    this.lock = new Auth0Lock(clientID, authDomain, {
      auth: {
        params: {
          scope: 'openid email'
        },
      },
    })

    this.showLock = this.showLock.bind(this)

    this.lock.on('authenticated', this.authProcess.bind(this))
  }

  authProcess = (authResult) => {

  }

  showLock() {
    this.lock.show()
  }

  setToken = (authFields) => {
    let {
      idToken,
      exp
    } = authFields
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('exp', exp * 1000)
  }

  isCurrent = () => {
    let expString = localStorage.getItem('exp')
    if (!expString) {
      localStorage.removeItem('idToken')
      return false
    }
    let now = new Date()
    let exp = new Date(parseInt(expString, 10)) // 10 is radix parameter
    if (exp < now) {
      this.logout()
      return false
    } else {
      return true
    }
  }

  getToken() {
    let idToken = localStorage.getItem('idToken')
    if (this.isCurrent() && idToken) {
      return idToken
    } else {
      localStorage.removeItem('idToken')
      localStorage.removeItem('exp')
      return false
    }
  }

  logout = () => {
    localStorage.removeItem('idToken')
    localStorage.removeItem('exp')
    location.reload()
  }
}
