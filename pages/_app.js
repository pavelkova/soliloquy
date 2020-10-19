import App from 'next/app'
import { withUrqlClient } from 'next-urql'

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}

App.getServerSideProps = async (ctx) => {
  const appProps = await App.getServerSideProps(ctx)
}

export default withUrqlClient((_ssr, ctx) => {
  return {
    url: '/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
    },
    fetch
  }
})(MyApp)
