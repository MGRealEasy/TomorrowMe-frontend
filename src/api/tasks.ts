// src/api/tasks.ts

import { api } from './index'

export interface Task {
	task_id: number
	user_id: number
	task_number: number
	task_description: string
	priority?: string
	status?: string
	importance?: number
	is_completed?: boolean
	custom_field?: string
	created_at?: string
	updated_at?: string
}

export interface TaskData {
	task_number: number
	task_description: string
	priority?: string
	status?: string
	importance?: number
	is_completed?: boolean
	custom_field?: string
}

// Функция для получения задач по tguser_id
export const fetchTasksByUserId = async (
	tguser_id: number
): Promise<Task[]> => {
	try {
		const response = await api.get<Task[]>('/tasks', {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching tasks:', error)
		throw error
	}
}

// Функция для создания новой задачи
export const createTask = async (
	tguser_id: number,
	taskData: TaskData
): Promise<Task> => {
	try {
		if (taskData.task_number === undefined || !taskData.task_description) {
			throw new Error('task_number и task_description обязательны.')
		}

		const response = await api.post<Task>('/tasks', taskData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error creating task:', error)
		throw error
	}
}

// Функция для обновления задачи
export const updateTask = async (
	tguser_id: number,
	task_id: number,
	taskData: Partial<TaskData>
): Promise<Task> => {
	try {
		const response = await api.put<Task>(`/tasks/${task_id}`, taskData, {
			params: { tguser_id },
		})
		return response.data
	} catch (error) {
		console.error('Error updating task:', error)
		throw error
	}
}

// Функция для удаления задачи
export const deleteTask = async (
	tguser_id: number,
	task_id: number
): Promise<{ message: string }> => {
	try {
		const response = await api.delete<{ message: string }>(
			`/tasks/${task_id}`,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error deleting task:', error)
		throw error
	}
}
