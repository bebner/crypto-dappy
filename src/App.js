import React from 'react'

import Navbar from './components/Navbar'
import Providers from './providers/Providers.comp';
import Routes from './components/Routes.comp'
import { ROUTES } from './config/routes.config';

export default function App() {
  return (
    <Providers>
      <Navbar />
      <Routes routes={ROUTES} />
    </Providers>
  )
}
