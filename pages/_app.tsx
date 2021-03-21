import React from 'react'
import NextApp, { AppProps } from 'next/app'
import { withUrqlClient, NextUrqlAppContext } from 'next-urql'
import { defaultExchanges } from 'urql'
import { devtoolsExchange } from '@urql/devtools'
import { ThemeProvider, Flex } from 'theme-ui'
import { Navbar } from 'components/Navbar'
import theme from 'styles/theme'
import { Footer } from 'components/Footer'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Flex sx={{ flexDirection: 'column',
                  minHeight: '100vh',
                  p: 2 }}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </Flex>
    </ThemeProvider>
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
