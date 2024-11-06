// src/api/user.ts

import { api } from './index'

export interface User {
	user_id: number
	telegram_id: number
	first_name?: string
	last_name?: string
	preferred_name?: string
	age?: number
	family_status?: string
	city?: string
	timezone?: string
	occupation?: string
	company_or_school_name?: string
	position_or_field_of_study?: string
	years_at_job_or_study?: number
	emotional_stability_notes?: string
	communication_style?: string
	custom_notes?: string
	custom_field?: string
	created_at?: string
	updated_at?: string
}

export const fetchUserByTelegramId = async (
	tguser_id: number
): Promise<User> => {
	try {
		const response = await api.get<User>('/user', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching user:', error)
		throw error
	}
}

export const updateUser = async (
	tguser_id: number,
	userData: Partial<User>
): Promise<User> => {
	try {
		const response = await api.put<User>('/user', userData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error updating user:', error)
		throw error
	}
}

export interface UserStatistic {
	statistics_id: number
	user_id: number
	date: string // ISO string
	tasks_completed: number
	tasks_pending: number
	habits_followed: number
	productivity_score: number
	notes?: string
	custom_field?: string
	created_at?: string
	updated_at?: string
}

export const fetchUserStatistics = async (
	tguser_id: number
): Promise<UserStatistic[]> => {
	try {
		const response = await api.get<UserStatistic[]>('/user/statistics', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching user statistics:', error)
		throw error
	}
}
