import { useRouter } from 'next/router'
import { useAuth } from './use-auth'

const DefaultLoadingFallback = () => {
  return <p>Loading...</p>
}

/**
 * Support client-side conditional redirecting based on the user's
 * authenticated state.
 *
 * @param WrappedComponent The component that this functionality
 * will be added to.
 * @param LoadingComponent The component that will be rendered while
 * the auth state is loading.
 * @param expectedAuth Whether the user should be authenticated for
 * the component to be rendered.
 * @param location The location to redirect to.
 */

function withAuthRedirect({
  WrappedComponent,
  LoadingComponent = DefaultLoadingFallback,
  expectedAuth,
  location
}) {
  const WithAuthRedirectWrapper = props => {
    const router = useRouter()
    const { isLoading, isAuthenticated } = useAuth()
    if (isLoading) {
      return <LoadingComponent/>
    }
    if (typeof window !== 'undefined' && expectedAuth !== isAuthenticated) {
      router.push(location)
      return <></>
    }
    return <WrappedComponent {...props} />
  }
  return WithAuthRedirectWrapper
}

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
 */

export function withAuth(WrappedComponent, location = '/login') {
  return withAuthRedirect({
    WrappedComponent,
    location,
    expectedAuth: true
  })
}

/**
 * Require the user to be unauthenticated in order to render the component.
 * If the user is authenticated, forward to the given URL.
 */

export const withoutAuth(WrappedComponent, location = '/today') {
  return withAuthRedirect({
    WrappedComponent,
    location,
    expectedAuth: false
  })
}
