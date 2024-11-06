import { api } from './index'

export interface Habit {
	habit_id: number
	user_id: number
	habit_number: number
	habit_description: string
	habit_type?: string
	start_date?: string // Формат YYYY-MM-DD
	importance?: number
	is_active?: boolean
	custom_field?: string
	created_at?: string
	updated_at?: string
}

export interface HabitData {
	habit_number: number
	habit_description: string
	habit_type?: string
	start_date?: string // Формат YYYY-MM-DD
	importance?: number
	is_active?: boolean
	custom_field?: string
}

export const fetchHabitsByUserId = async (
	tguser_id: number
): Promise<Habit[]> => {
	try {
		const response = await api.get<Habit[]>('/habits', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching habits:', error)
		throw error
	}
}

export const createHabit = async (
	tguser_id: number,
	habitData: HabitData
): Promise<Habit> => {
	try {
		if (
			habitData.habit_number === undefined ||
			!habitData.habit_description
		) {
			throw new Error('habit_number и habit_description обязательны.')
		}

		const response = await api.post<Habit>('/habits', habitData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error creating habit:', error)
		throw error
	}
}

export const updateHabit = async (
	tguser_id: number,
	habit_id: number,
	habitData: Partial<HabitData>
): Promise<Habit> => {
	try {
		const response = await api.put<Habit>(
			`/habits/${habit_id}`,
			habitData,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error updating habit:', error)
		throw error
	}
}

export const deleteHabit = async (
	tguser_id: number,
	habit_id: number
): Promise<{ message: string }> => {
	try {
		const response = await api.delete<{ message: string }>(
			`/habits/${habit_id}`,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error deleting habit:', error)
		throw error
	}
}
