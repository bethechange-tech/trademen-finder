"use client"

import { useEffect, useCallback, useState } from "react"
import { register, Hanko } from "@teamhanko/hanko-elements"
import { getAuthUser } from "@/utils/actions"
import axios from "axios"

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || ''

export default function HankoAuth({ page }: { page: string }) {
  const [hanko, setHanko] = useState<Hanko>()

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi, {}))
    )
  }, [])

  const redirectAfterLogin = useCallback(async () => {
    // here we use the api we created to add a new user to users table
    await hanko?.user.getCurrent()

    const user = await getAuthUser()

    if (user?.id) {
      await axios.post('/api/connect-user-after-add-user', {
        email: user?.email,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      return window.location.href = '/'
    }

    // successfully logged in, redirect to a page in your application
    window.location.href = `/create-profile?page=${page}`
  }, [hanko?.user, page])

  useEffect(
    () => {
      hanko?.onSessionCreated(() => {
        redirectAfterLogin()
      })
    }
    ,
    [hanko, redirectAfterLogin]
  )

  useEffect(() => {
    register(hankoApi).catch((error) => {
      // handle error

      console.log('----99----')
      console.log(error)
      console.log('====99====')
    })
  }, [])
  //@ts-ignore
  return <hanko-auth />
}
