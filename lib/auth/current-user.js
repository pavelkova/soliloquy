import { useEffect } from 'react'
import { useQuery } from 'urql'
import Router from 'next/router'

export const useCurrentUser = ({ redirectTo, redirectIfFound }) => {
    const { data, error } = useQuery(CURRENT_USER)
    const user = data?.user
    const finished = Boolean(data)
    const hasUser = Boolean(user)

    useEffect(() => {
        if (!redirectTo || !finished) return
        if (
            (redirectTo && !redirectIfFound && !hasUser) ||
            (redirectIfFound && hasUser)
        ) {
            Router.push(redirectTo)
        }
    }, [redirectTo, redirectIfFound, finished, hasUser])

    return error ? null : user
}
