import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
      {/* <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Inconsolata&family=Oswald&family=Playfair+Display:ital@0;1&family=Raleway&family=Roboto+Mono&family=Quattrocento&family=Lato&display=swap"
          rel="stylesheet"
          /> */}
            <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,800;1,400;1,700&family=Inconsolata&family=Oswald&family=Open+Sans&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:ital@0;1&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          `}</style>
      </Html>
    )
  }
}

export default MyDocument
