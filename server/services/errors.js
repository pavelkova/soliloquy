/* authentication: must be logged in
 * login: bad email or password
 * signup: user already exists, bad email or password validation
 * updatePreferences:
 * updatePassword:
 * network: a network error ocurred
 * unknown: an unknown error ocurred */

export const errors = {
  signup: {
    userExists: 'A user with this email address already exists.',
  },
  login: {
    incorrect:
      'The email or password you entered is incorrect. Please check your credentials.',
    notLoggedIn: 'Please log in to continue.',
  },
}
