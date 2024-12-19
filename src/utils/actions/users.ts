'use server'

import { CacheService } from '@/services/cache'
import tradesMenRequest from '@/lib/requesters'
import { ExtendedUser } from '@/types'

const cacheUser = async (user: ExtendedUser) => {
    const cacheService = CacheService.getInstance()
    await cacheService?.set('user', JSON.stringify(user))
}

const fetchWithCache = async (url: string) => {
    try {
        const cacheService = CacheService.getInstance()
        const cachedData = await cacheService?.get('user')

        if (cachedData) {
            return cachedData as unknown as ExtendedUser
        }

        const response = await tradesMenRequest.get<ExtendedUser>(url)
        const user = response.data

        if (user) {
            await cacheUser(user)
        }

        return user
    } catch (error) {
        console.error('Error fetching with cache:', error)
        return null
    }
}

export const getAuthUser = async () => {
    try {
        return fetchWithCache('/api/users/me')
    } catch (error) {
        console.error('Error getting authenticated user:', error)
        return null
    }
}

export const getUsers = async () => {
    try {
        const response = await tradesMenRequest.get<{
            users: ExtendedUser[]
        }>('/users')
        return response.data.users
    } catch (error) {
        return []
    }
}

