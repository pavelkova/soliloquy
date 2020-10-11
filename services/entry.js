import { db } from 'db'

export const entryService = () => {
  const t = db('entries')
  const columns = [
    'id',
    'user_id as userId',
    'created_at as createdAt',
    'updated_at as updatedAt',
    'title_date as titleDate',
    'content'
  ]

  const findById = async id => {
    return await t
      .select(columns).where({ id }).first()
  }

  const findByDate = async (user, titleDate) => {
    return await t
      .select(columns).where({ user_id: user.id,
                               title_date: titleDate }).first()
  }

  const findAll = async user => {
    return await t
      .select(columns).where({ user_id: user.id })
  }

  const create = async (user, titleDate, content) => {
    /* let entry = await findByDate */
    // prevent creation if date is not today
    // check if entry exists, return if so
    // insert on db where user = context.currentUser, date = today, return
    // create activity log with start date
    return await t
      .returning(columns)
      .insert({ user_id: user.id, title_date: titleDate, content })
  }

  const update = async (id, content) => {
    return await t
      .where({ id })
      .update({ content })
      .returning(columns)
    // prevent update if today is not today
    // find entry with today's date
    // check if updated_at was more than five minutes ago; if so, get most recent activity log; if it has content, create new activity log; if not,
    // add updated content
    // else create entry with content
    // check if activity log exists with end_time less than five minutes ago
    // if so, update existing activity log with current time
    // else add new activity log
  }

  return { findById, findByDate, findAll, create, update }
}
