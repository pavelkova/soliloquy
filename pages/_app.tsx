import React from 'react'
import NextApp, { AppProps } from 'next/app'
import { withUrqlClient, NextUrqlAppContext } from 'next-urql'
import { defaultExchanges } from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import { Flex } from 'theme-ui'
import { Navbar } from 'components/Navbar'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Flex sx={{ flexDirection: 'column',
                minHeight: '100vh',
                p: 2 }}>
      {/* <Flex flexDirection='column' minHeight='100vh' p={2}> */}
      <Navbar />
      <Component {...pageProps} />
    </Flex>
  )
  /* return <Component {...pageProps} /> */
}

App.getServerSideProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getServerSideProps(ctx)
  return { ...appProps }
}

export default withUrqlClient((_ssr, ctx) => {
  return {
    url: 'http://localhost:3000/api/graphql',
    fetchOptions: {
      credentials: 'same-origin',
      headers: {
        cookie: ctx?.req?.headers?.cookie ?? ''
      }
    },
    exchanges: [devtoolsExchange, ...defaultExchanges],
    fetch
  }
}, { ssr: false })(App)
