'use server'
import { jwtVerify, createRemoteJWKSet } from "jose"
import type { UserToken } from "./hanko-helpers.d"
import { cookies } from "next/headers"

export const getHankoToken = async () => {
    const cookieStore = await cookies()
    const hanko = await cookieStore.get("hanko")
    return hanko?.value
}

export const getHankoSession = async (token?: string) => {
    const hankoApiUrl = process.env?.HANKO_API_URL || process.env?.NEXT_PUBLIC_HANKO_API_URL
    try {
        const hanko = token || await getHankoToken()
        const JWKS = createRemoteJWKSet(
            new URL(`${hankoApiUrl}/.well-known/jwks.json`)
        )

        const { payload } = await jwtVerify(hanko ?? "", JWKS)

        const userPayload = payload as UserToken['payload']

        return {
            email: userPayload.email.address,
            authProviderId: userPayload.sub || '',
            exp: userPayload.exp
        }

    } catch (error) {
        return null
    }
}


export async function isTokenExpired(expiration: number | undefined) {
    return !expiration || expiration < Math.floor(Date.now() / 1000)
}