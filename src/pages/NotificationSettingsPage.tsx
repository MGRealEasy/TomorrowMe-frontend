import React, { useEffect, useState } from 'react'
import {
	fetchNotificationSettingsByUserId,
	createNotificationSetting,
	updateNotificationSetting,
	deleteNotificationSetting,
	NotificationSetting,
	NotificationSettingData,
} from '../api/notificationService'
import NotificationSettingForm from '../components/NotificationSettingForm'
import NotificationSettingsList from '../components/NotificationSettingsList'

const NotificationSettingsPage: React.FC = () => {
	const [notificationSettings, setNotificationSettings] = useState<
		NotificationSetting[]
	>([])
	const [loading, setLoading] = useState<boolean>(true)
	const tg = (window as any).Telegram.WebApp
	const user = tg.initDataUnsafe.user
	const tguser_id = user ? Number(user.id) : 1148831907
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchNotificationSettingsByUserId(tguser_id)
				setNotificationSettings(data)
			} catch (error) {
				console.error('Error fetching notification settings:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [tguser_id])

	const handleCreate = async (newSetting: NotificationSettingData) => {
		try {
			const createdSetting = await createNotificationSetting(
				tguser_id,
				newSetting
			)
			setNotificationSettings([...notificationSettings, createdSetting])
		} catch (error) {
			console.error('Error creating notification setting:', error)
		}
	}

	const handleUpdate = async (
		setting_id: number,
		updatedData: Partial<NotificationSettingData>
	) => {
		try {
			const updatedSetting = await updateNotificationSetting(
				tguser_id,
				setting_id,
				updatedData
			)
			setNotificationSettings(
				notificationSettings.map(setting =>
					setting.setting_id === setting_id ? updatedSetting : setting
				)
			)
		} catch (error) {
			console.error('Error updating notification setting:', error)
		}
	}

	const handleDelete = async (setting_id: number) => {
		try {
			await deleteNotificationSetting(tguser_id, setting_id)
			setNotificationSettings(
				notificationSettings.filter(
					setting => setting.setting_id !== setting_id
				)
			)
		} catch (error) {
			console.error('Error deleting notification setting:', error)
		}
	}

	if (loading) {
		return <div className="text-white">Загрузка...</div>
	}

	return (
		<div className="min-h-screen bg-black text-white p-4">
			<h1 className="text-3xl font-bold mb-4">Настройки уведомлений</h1>
			{/* Компонент для создания новой настройки */}
			<NotificationSettingForm onSubmit={handleCreate} />
			{/* Список текущих настроек */}
			<NotificationSettingsList
				settings={notificationSettings}
				onUpdate={handleUpdate}
				onDelete={handleDelete}
			/>
		</div>
	)
}

export default NotificationSettingsPage
