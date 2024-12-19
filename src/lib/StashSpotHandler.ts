import { cookies, headers } from "next/headers"
import { ControllerUtils } from "./controller-utils"

export class SessionHandler extends ControllerUtils {
    constructor() {
        super()
    }

    static isTokenExpired = async (token: string): Promise<boolean> => {
        try {
            const sessionHandler = new SessionHandler()
            await sessionHandler.jwtVerify(token, String(process.env.JWT_SECRET))

            return false
        } catch (error) {
            console.error('Failed to decode token:', error)
            return true // If there's an error decoding, consider the token expired.
        }
    }

    /**
     * Retrieves the 'payload-token' from cookies or authorization header.
     *
     * This method looks for the 'payload-token' cookie and returns its value.
     * If the cookie is not found, it checks the 'authorization' header for a JWT token.
     * If neither are found, it returns an empty string.
     *
     * @returns {string} The value of the 'payload-token' cookie or JWT token from the header, or an empty string if not found.
     */
    static async getToken() {
        const headersList = await headers()
        const cookieStore = await cookies()


        let token: string | undefined

        // Check the authorization header for a JWT token
        if (
            headersList?.get('authorization') &&
            (headersList?.get('authorization')?.startsWith('JWT') || headersList?.get('authorization')?.startsWith('Bearer'))
        ) {
            token = headersList?.get('authorization')?.split(' ')[1]
            console.info('Token extracted from authorization header', { token: token?.substring(0, 10) })
        };

        // Check cookies for the payload-token
        if (cookieStore.get("payload-token")?.value) {
            token = cookieStore.get("payload-token")?.value
            console.info('Token extracted from cookies', { token: token?.substring(0, 10) })
        };

        return token || ''
    }

    /**
     * Removes the 'payload-token' cookie and ensures future requests do not include the token in the header.
     *
     * This method clears the 'payload-token' cookie by setting its expiration date
     * to a date in the past, effectively removing it from the user's browser.
     * It also simulates the removal of the authorization header token by clearing the token variable.
     */
    static async removeToken() {
        // Remove the payload-token cookie
        (await cookies()).set('payload-token', '', { expires: new Date(0) })
        console.info('payload-token cookie removed.')

        // You cannot directly remove headers, but you can clear the token variable in your logic
        const headersList = await headers()

        if (headersList?.get('authorization') && headersList?.get('authorization')?.startsWith('JWT')) {
            // You would typically need to ensure this token is ignored in your application logic
            console.info('Authorization token should be ignored in future logic.')
            headersList.delete('authorization')
            headersList.set('authorization', '')
        }
    }
}
