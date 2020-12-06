import App from 'next/app'
import { withUrqlClient } from 'next-urql'
import { defaultExchanges } from 'urql'
import { devtoolsExchange } from '@urql/devtools'

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
      headers: {
        cookie: ctx?.req?.headers?.cookie ?? ''
      }
    },
    exchanges: [devtoolsExchange, ...defaultExchanges],
    fetch
  }
})(MyApp)
