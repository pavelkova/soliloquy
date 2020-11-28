const now = () => {
  return new Date().toISOString()
}

const toUTC = date => {
  return new Date(date).toISOString()
}

/**
 * Return a date string in YYYY-MM-DD format to query or insert
 * to database column type "date".
 *
 * @param tz String containing IANA timezone name, e.g. "America/New_York"
 * @param date String to be converted into Javascript Date object--
 *             if not provided, returns today
*/
const formatEntryDate = (tz, date = '') => {
  const d = date ? new Date(date) : new Date()
  const options = { timeZone: tz,
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'}

  const [month, day, year] = d.toLocaleDateString('en-US', options).split('/')

  return year + '-' + month + '-' + day
}

const formatLocalDateTime = (tz, options = {}, date = '', locale = 'en-US') => {
  /* options = {
   *   dateStyle: ['full', 'long', 'medium', 'short'],
   *   timeStyle: ['full', 'long', 'medium', 'short'],
   *   hour12: [false, true],
   *   year: ['2-digit', 'numeric'],
   *   month: ['2-digit', 'long', 'narrow', 'numeric', 'short'],
   *   day: ['2-digit'],
   *   hour: ['2-digit'],
   *   minute: ['2-digit'],
   *   second: ['2-digit'],
   *   timeZoneName: ['long', 'short']
   * }
   */
  const d = date ? new Date(date) : new Date()
  options.timeZone = tz

  return d.toLocaleString(locale, options)
}

const getTimeSince = time => {
  return Date.now() - new Date(time)
}

const getTimeBetween = (start, end) => {
  return new Date(end) - new Date(start)
}


// TODO move to validators when that file is ready
const isValid = {
  year: yyyy => {
    return Boolean(yyyy.match(/[0-9]{4})/)
                   && parseInt(yyyy) >= 1970
                   && parseInt(yyyy) <= new Date().getUTCFullYear())
  },
  month: mm => {
    return Boolean(mm.match(/[0-9]{1,2}/)
                && parseInt(mm) >= 1
                && parseInt(mm) <= 12)
  },
  day: dd => {
    return Boolean(dd.match(/[0-9]{1,2}/)
                   && parseInt(dd) >= 1
                   && parseInt(mm) <= 31)
  }
}

export { now,
         toUTC,
         isValid,
         formatEntryDate,
         formatLocalDateTime,
         getTimeSince,
         getTimeBetween }

/*
   postgres timestamp = YYYY-MM-DD HH:MM:SS.[......]-TZ
   new Date() = YYYY-MM-DD'T'HH:MM:SS.000Z
 */

/* titleDate = formatWithLocale(user, { dateStyle: 'long' })*/
