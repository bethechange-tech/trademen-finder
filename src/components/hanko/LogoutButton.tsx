"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Hanko } from "@teamhanko/hanko-elements"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL

export function LogoutBtn() {
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

  return <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={logout}>  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 w-4 h-4" /> Logout</button>
}
