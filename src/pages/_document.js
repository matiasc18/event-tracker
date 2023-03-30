import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="https://maps.googleapis.com/maps/api/js?key=<AIzaSyD4em4ap2i0-MLs5PTfkVWdI2uwgSGzONQ>&v=3.exp&libraries=geometry,drawing,places"></script>
        <meta name="description" content="Event project app for COP 4710 - UCF Spring 2023" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
