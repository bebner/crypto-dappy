import { useState } from 'react'

export default function useCurrentUser() {
  const [user, setUser] = useState({ loggedIn: false })

  const tools = {
    logIn: () => setUser({ loggedIn: true, addr: "MY_ADDRESS" }),
    logOut: () => setUser({ loggedIn: false }),
  }



  return [user, user?.addr != null, tools]
}
