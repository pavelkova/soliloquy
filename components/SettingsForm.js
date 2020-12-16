import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import UPDATE_SETTINGS from 'mutations/UpdateSettings.graphql'

export const SettingsForm = (props) => {

  const { register, handleSubmit, errors } = useForm()

  const [result, updateSettings] = useMutation(UPDATE_SETTINGS)

  const onSubmit = async values => {
    console.log(values)
    if (errors) console.error(errors)

    const { data, fetching, error } = await updateSettings({ settings: values })

    if (error) { console.error(error) }

    /* if (data?.login) redirectOnSuccess() */
    console.log(data)
    // setError
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div>
        <h2>General</h2>
        <div>
          <label>
            <h3>Word Count Goal</h3>
            <input type='number' name='wordCountGoal' ref={
            register}/>
          </label>
        </div>
      </div>

      <div>
        <h2>Date & Time</h2>
        <div>
          <label>
            <h3>Day starts at</h3>
            <input type='time' name='dayStartsAt' ref={
            register}/>
          </label>
        </div>
        <div>
          <h3>Clock display format</h3>
          <label>
            <input type='radio' name='timeFormat' ref={
            register}/>
            <span>12-hour</span>
          </label>
          <label>
            <input type='radio' name='timeFormat' ref={
            register}/>
            <span>24-hour</span>
          </label>
        </div>
        <div>
          <label>
            <h3>Timezone</h3>
            <select name='timezone' ref={
            register}>
              <option value='auto'>Autodetect</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <h2>Appearance</h2>
        <div>
          <label>
            <h3>Font name</h3>
            <input type='number' name='fontName' ref={
            register}/>
          </label>
        </div>
        <div>
          <label>
            <h3>Font size</h3>
            <input type='number' name='fontSize' ref={
            register}/>
          </label>
        </div>
        <div>
          <label>
            <h3>Theme</h3>
            <select name='theme' ref={
            register}>
              <option value='auto'>Basic</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            <h3>Text Color</h3>
            <input type='color' name='textColor' ref={
            register}/>
          </label>
        </div>
        <div>
          <label>
            <h3>Background Color</h3>
            <input type='color' name='backgroundColor' ref={
            register}/>
          </label>
        </div>
        <div>
          <label>
            <h3>Highlight Color</h3>
            <input type='color' name='highlightColor' ref={
            register}/>
          </label>
        </div>
      </div>

      <div>
        <h2>Account Settings</h2>
        <div>
          <label>
            <h3>Text Analysis</h3>
            <input type='checkbox' name='textAnalysis' ref={
            register}/>
          </label>
        </div>

        <div>
          <label>
            <h3>Email Address</h3>
            <input type='email' name='email' ref={
            register}/>
          </label>
        </div>
        <div>
          <label>
            <h3>Name</h3>
            <input type='text' name='name' ref={
            register}/>
          </label>
        </div>
        <div>
          <h3>Update Password</h3>
          <label>
            <span>Current password</span>
            <input type='password' name='currentPassword' ref={
            register}/>
          </label>
          <label>
            <span>New password</span>
            <input type='password' name='newPassword' ref={
            register}/>
          </label>
        </div>
      </div>
      <input type="submit"/>
    </form>
  )
}
