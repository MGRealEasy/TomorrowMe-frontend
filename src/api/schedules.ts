// src/api/tasks.ts

import { api } from './index'

export interface Schedule {
	schedule_id: number
	user_id: number
	activity: string
	date: string // Дата в формате 'YYYY-MM-DD'
	time_frame: string // Время, например, '15:00'
	is_recurring?: boolean
	importance?: number
	is_completed?: boolean
	custom_field?: string
	created_at?: string // ISO строка
	updated_at?: string // ISO строка
}

export interface ScheduleData {
	activity: string
	date: string // Дата в формате 'YYYY-MM-DD'
	time_frame: string // Время, например, '15:00'
	is_recurring?: boolean
	importance?: number
	is_completed?: boolean
	custom_field?: string
}

// Функция для получения задач по tguser_id
// Функция для получения расписания по tguser_id
export const fetchSchedulesByUserId = async (
	tguser_id: number
): Promise<Schedule[]> => {
	try {
		const response = await api.get<Schedule[]>('/schedules', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching schedules:', error)
		throw error
	}
}

// Функция для создания нового расписания
export const createSchedule = async (
	tguser_id: number,
	scheduleData: ScheduleData
): Promise<Schedule> => {
	try {
		// Проверка обязательных полей
		if (
			!scheduleData.activity ||
			!scheduleData.date ||
			!scheduleData.time_frame
		) {
			throw new Error('activity, date и time_frame обязательны.')
		}

		const response = await api.post<Schedule>('/schedules', scheduleData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error creating schedule:', error)
		throw error
	}
}
// Функция для обновления расписания
export const updateSchedule = async (
	tguser_id: number,
	schedule_id: number,
	scheduleData: Partial<ScheduleData>
): Promise<Schedule> => {
	try {
		const response = await api.put<Schedule>(
			`/schedules/${schedule_id}`,
			scheduleData,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error updating schedule:', error)
		throw error
	}
}
// Функция для удаления расписания
export const deleteSchedule = async (
	tguser_id: number,
	schedule_id: number
): Promise<{ message: string }> => {
	try {
		const response = await api.delete<{ message: string }>(
			`/schedules/${schedule_id}`,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error deleting schedule:', error)
		throw error
	}
}
