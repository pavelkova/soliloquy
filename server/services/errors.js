/* authentication: must be logged in
 * login: bad email or password
 * signup: user already exists, bad email or password validation
 * updatePreferences:
 * updatePassword:
 * network: a network error ocurred
 * unknown: an unknown error ocurred */

export const errors = {
  auth: {
    isNull: 'Please log in to continue.',
    signup: {
      userExists: 'A user with this email address already exists.'
    },
    login: {
      badCredentials: 'The email or password you entered is incorrect. Please check your credentials.'
    }
  },
  entry: {
    isNull: 'No entry matches the parameters.',
    createFailed: 'Could not create an entry for this day.',
    updateFailed: {
      expired: 'This entry is from a previous day and can no longer be edited.',
      general: 'Could not save entry.'
    },
    stats: {
      isNull: 'No stats for this day'
    }
  }
}
