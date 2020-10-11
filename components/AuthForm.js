import React from 'react'

export const AuthForm = (props) => {
  let signup = (props.formName == 'signup')

  return (
    <div>
      <form>
        <input name="email"></input>
        <input name="password"></input>
        {signup ? <input type="password"></input> : ''}
      </form>
    </div>
  )
}
