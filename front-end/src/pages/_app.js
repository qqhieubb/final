import 'bootstrap/dist/css/bootstrap.min.css'
import { Component } from 'react'
import Header from '../conponents/Layout/Header'

import '../public/css/styles.css'
import '../public/css/Header.css'

function MyApp({ Component, pageProps }) {
    return (
      <>
      <Header />
      <Component {...pageProps} />
      </>
      
    );
  }
export default MyApp
