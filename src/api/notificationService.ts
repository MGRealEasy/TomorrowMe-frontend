import { api } from './index'

export interface NotificationSetting {
	setting_id: number
	user_id: number
	item_type: string
	task_id?: number
	schedule_id?: number
	reminder_type: string
	reminder_times: string
	sent_times?: string
	is_active: boolean
	is_pending_acknowledgment: boolean
	last_message_id?: number
	created_at?: string
	updated_at?: string
}

export interface NotificationSettingData {
	item_type: string
	task_id?: number
	schedule_id?: number
	reminder_type: string
	reminder_times: string
	is_active?: boolean
	is_pending_acknowledgment?: boolean
	last_message_id?: number
}

export const fetchNotificationSettingsByUserId = async (
	tguser_id: number
): Promise<NotificationSetting[]> => {
	try {
		const response = await api.get<NotificationSetting[]>(
			'/notifications',
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error fetching notification settings:', error)
		throw error
	}
}

export const createNotificationSetting = async (
	tguser_id: number,
	notificationData: NotificationSettingData
): Promise<NotificationSetting> => {
	try {
		if (!notificationData.item_type || !notificationData.reminder_times) {
			throw new Error(
				'item_type, reminder_type и reminder_times обязательны.'
			)
		}

		// Преобразование reminder_times в массив, если это строка
		let reminderTimesFormatted

		if (typeof notificationData.reminder_times === 'string') {
			// Если это одиночная строка, преобразуем в массив
			reminderTimesFormatted = [notificationData.reminder_times]
		} else if (Array.isArray(notificationData.reminder_times)) {
			// Если это уже массив, оставляем как есть
			reminderTimesFormatted = notificationData.reminder_times
		} else {
			// Если это другой тип, выбрасываем ошибку
			throw new Error('Invalid format for reminder_times.')
		}

		// Преобразуем в JSON
		const formattedData = {
			...notificationData,
			reminder_times: JSON.stringify(reminderTimesFormatted),
		}

		const response = await api.post<NotificationSetting>(
			'/notifications',
			formattedData,
			{
				params: { tguser_id },
			}
		)
		return response.data
	} catch (error) {
		console.error('Error creating notification setting:', error)
		throw error
	}
}

export const updateNotificationSetting = async (
	tguser_id: number,
	setting_id: number,
	notificationData: Partial<NotificationSettingData>
): Promise<NotificationSetting> => {
	try {
		const response = await api.put<NotificationSetting>(
			`/notifications/${setting_id}`
		)
		return response.data
	} catch (error) {
		console.error('Error updating notification setting:', error)
		throw error
	}
}

export const deleteNotificationSetting = async (
	tguser_id: number,
	setting_id: number
): Promise<{ message: string }> => {
	try {
		const response = await api.delete<{ message: string }>(
			`/notifications/${setting_id}`
		)
		return response.data
	} catch (error) {
		console.error('Error deleting notification setting:', error)
		throw error
	}
}
