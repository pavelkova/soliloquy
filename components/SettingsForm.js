import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const SettingsForm = (props) => {

  const { register, handleSubmit, errors } = useForm()

  return (
    <form>

      <div>
        <label>
          <span>Word Count Goal</span>
          <input type='number' name='wordCountGoal' ref={
          register({ required: true })}/>
        </label>
      </div>

      <div>
        <label>
          <span>Day starts at</span>
          <input type='time' name='dayStartsAt' ref={
          register({ required: true })}/>
        </label>
      </div>

      <div>
        <label>
          <span>12-hour</span>
          <input type='radio' name='timeFormat' ref={
          register({ required: true })}/>
        </label>
        <label>
          <span>24-hour</span>
          <input type='radio' name='timeFormat' ref={
          register({ required: true })
          } />
        </label>
      </div>


      <div>
        <label>
          <span>Timezone</span>
          <select name='dayStartsAt' ref={
          register({ required: true })}>
            <option value='auto'>Autodetect</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <span>Font size</span>
          <input type='number' name='fontSize' ref={
          register({ required: true })}/>
        </label>
      </div>

    </form>
  )
}
