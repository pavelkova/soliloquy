/* truly terrible function names */

const getTimeSince = time => {
  return Date.now() - new Date(time)
}

const formatWithLocale = (user, options = {}, date = '') => {
  console.log('format with locale')
  console.log(user)
  const d = date ? new Date(date) : Date.now()

  if (user.settings?.timezone) {
    options.timeZone = user.settings.timezone
  }
  // add user.settings.locale eventually
  return d.toLocaleString('en-US', options)
}

const createDateWithLocale = (user, options = {}, date = '') => {
  const dateString = formatWithLocale(user, options, date)
  return new Date(dateString)
}

const splitDateFields = d => {
  return { yyyy: d.getFullYear(),
           mm: d.getMonth() + 1,
           dd: d.getDate() }
}

const splitDateFieldsToStrings = d => {
  const yyyy  = ('20' + d.getFullYear()).slice(0,4)
  const mm = ('0' + (d.getMonth()+1)).slice(-2)
  const dd = ('0' + d.getDate()).slice(-2)
  return { yyyy, mm, dd }
}

const todayFieldsWithUserLocale = user => {
  const todayFields =
    createDateWithLocale(user)
  return splitDateFields(todayFields)
}

export { getTimeSince,
         formatWithLocale,
         createDateWithLocale,
         splitDateFields,
         splitDateFieldsToStrings,
         todayFieldsWithUserLocale }

/*
   postgres timestamp = YYYY-MM-DD HH:MM:SS.[......]-TZ
   new Date() = YYYY-MM-DD'T'HH:MM:SS.000Z
 */

/* titleDate = formatWithLocale(user, { dateStyle: 'long' })*/
