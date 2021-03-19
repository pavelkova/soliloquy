import React, { useState } from 'react'
import { Box, Flex, Input, Label, Select } from 'theme-ui'
import { AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
const isRequired = { required: true }

export const useFormFields = (register) => {

  const EmailAddress = ({ checkPattern = false, name = 'email' }) => {
    const registerProps = checkPattern
                        ? { ...isRequired, pattern: /^\S+@\S+$/i }
                        : isRequired
    return (
      <>
        <Label htmlFor='email'>Email address</Label>
        <Input type='email' name={ name } ref={register(registerProps)} />
      </>
    )
  }

  const Password = ({checkPattern = false, name = 'password', title = 'Password'}) => {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const registerProps = checkPattern
                        ? { ...isRequired }
                        : isRequired
    return (
      <>
        <Label htmlFor='password'>{ title }</Label>
        <Flex sx={{ alignItems: 'center' }}>
          <Input type={ passwordVisible ? 'text' : 'password' }
                 name={ name }
                 ref={register(registerProps)} />
          <Box sx={{ fontSize: 3, pt: 1, ml: 1 }}
            onClick={ (e) => setPasswordVisible(!passwordVisible) }>
            { passwordVisible && <AiOutlineEye /> }
            { !passwordVisible && <AiOutlineEyeInvisible /> }
          </Box>
        </Flex>
      </>
    )
  }

  const Name = () => {
  const registerProps = { ...isRequired, maxLength: {
    value: 80,
    message: 'Name cannot be more than 80 characters long.' }}

  return (
    <>
      <Label htmlFor='name'>Name</Label>
      <Input type='text' name='name' ref={register(registerProps)} />
    </>
  )
}

const Timezone = () => {
  return (
    <Select name='timezone'>

    </Select>
  )
}

  return [EmailAddress,
          Password,
          Name,
          Timezone]
}
