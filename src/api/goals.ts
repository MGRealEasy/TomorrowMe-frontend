// src/api/goals.ts

import { api } from './index'

export interface Goal {
	goal_id: number
	user_id: number
	goal_number: number
	goal_type?: string
	goal_description: string
	start_date?: string
	end_date?: string
	importance?: number
	is_completed?: boolean
	is_active?: boolean
	custom_field?: string
	created_at?: string
	updated_at?: string
}

export interface GoalData {
	goal_number: number
	goal_type?: string
	goal_description: string
	start_date?: string
	end_date?: string
	importance?: number
	is_completed?: boolean
	is_active?: boolean
	custom_field?: string
}

export const fetchGoalsByUserId = async (
	tguser_id: number
): Promise<Goal[]> => {
	try {
		const response = await api.get<Goal[]>('/goals', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching goals:', error)
		throw error
	}
}

export const createGoal = async (
	tguser_id: number,
	goalData: GoalData
): Promise<Goal> => {
	try {
		if (goalData.goal_number === undefined || !goalData.goal_description) {
			throw new Error('goal_number и goal_description обязательны.')
		}

		const response = await api.post<Goal>('/goals', goalData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error creating goal:', error)
		throw error
	}
}

export const updateGoal = async (
	tguser_id: number,
	goal_id: number,
	goalData: Partial<GoalData>
): Promise<Goal> => {
	try {
		const response = await api.put<Goal>(`/goals/${goal_id}`, goalData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error updating goal:', error)
		throw error
	}
}

export const deleteGoal = async (
	tguser_id: number,
	goal_id: number
): Promise<{ message: string }> => {
	try {
		const response = await api.delete<{ message: string }>(
			`/goals/${goal_id}`,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error deleting goal:', error)
		throw error
	}
}
