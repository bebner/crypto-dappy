import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import UserProvider from "./UserProvider"
import TxProvider from './TxProvider'
import AuthProvider from './AuthProvider'
import MarketProvider from './MarketProvider'

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TxProvider>
          <UserProvider>
            <MarketProvider>
              <div className="app">
                {children}
              </div>
            </MarketProvider>
          </UserProvider>
        </TxProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
