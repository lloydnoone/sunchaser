class Auth {
  static setToken(token) {
    localStorage.setItem('token', token)
  } 

  static getToken() {
    return localStorage.getItem('token')
  }

  static logout () {  // do not need to return anything from this function - removes token from App to log user out
    localStorage.removeItem('token')
  }

  static getPayload () {
    const token = this.getToken() // the same get token function as above 
    if (!token) return false // if there is no token available 
    const parts = token.split('.') // splits token into an array at each dot (3 parts) JSON web token is always 3 parts
    // and industry standard
    if (parts.length < 3) return false // checks token length 
    return JSON.parse(atob(parts[1])) // decoding the token - it is a JSON item 

  }
  
  static isAuthenticated() {
    const payload = this.getPayload()
    if (!payload) return false
    const now = Math.round(Date.now() / 1000)
    return now < payload.exp // if time now is less than payload expiry time 
  }

}

export default Auth