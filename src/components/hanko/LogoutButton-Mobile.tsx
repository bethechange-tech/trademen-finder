"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Hanko } from "@teamhanko/hanko-elements"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL!

export function LogoutBtnMobile() {
  const router = useRouter()
  const [hanko, setHanko] = useState<Hanko>()

  useEffect(() => {
    import("@teamhanko/hanko-elements").then(({ Hanko }) =>
      setHanko(new Hanko(hankoApi ?? ""))
    )
  }, [])

  const logout = async () => {
    try {
      await hanko?.user.logout()
      router.push("/")
      router.refresh()
      return
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return <button className="text-purple-600 font-semibold text-lg flex items-center space-x-2" onClick={logout}>  <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />Logout</button>
}
