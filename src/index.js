
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar'
import Providers from './providers/Providers.comp';
import Routes from './components/Routes.comp'
import { ROUTES } from './config/routes.config';

import './index.css';
import './components/Atoms.css'

ReactDOM.render(
  <Providers>
    <Navbar />
    <Routes routes={ROUTES} />
  </Providers>,
  document.getElementById('root')
);