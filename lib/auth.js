import Router from 'next/router'
import { useQuery, useMutation } from 'urql'
import CURRENT_USER from './queries/CurrentUser.graphql'
import SIGNUP_MUTATION from './mutations/Signup.graphql'
import LOGIN_MUTATION from './mutations/Login.graphql'

export const useUser = () => {
    const user = useQuery(CURRENT_USER)
    // redirect
}

export const useLoginMutation = () => {
    useMutation(LOGIN_MUTATION)
}

export const useSignupMutation = () => {
    useMutation(SIGNUP_MUTATION)
}
