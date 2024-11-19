import React, { useState } from 'react'
import {
	NotificationSetting,
	NotificationSettingData,
} from '../api/notificationService'
import UpdateModal from './UpdateModal'

interface NotificationSettingsListProps {
	settings: NotificationSetting[]
	onUpdate: (
		setting_id: number,
		updatedData: Partial<NotificationSettingData>
	) => void
	onDelete: (setting_id: number) => void
}

const NotificationSettingsList: React.FC<NotificationSettingsListProps> = ({
	settings,
	onUpdate,
	onDelete,
}) => {
	const [isModalOpen, setModalOpen] = useState(false)
	const [currentSetting, setCurrentSetting] =
		useState<NotificationSetting | null>(null)

	const handleUpdateClick = (setting: NotificationSetting) => {
		setCurrentSetting(setting)
		setModalOpen(true)
	}

	const handleModalClose = () => {
		setModalOpen(false)
		setCurrentSetting(null)
	}

	const handleSaveChanges = (
		updatedData: Partial<NotificationSettingData>
	) => {
		if (currentSetting) {
			onUpdate(currentSetting.setting_id, updatedData)
			handleModalClose()
		}
	}

	return (
		<div>
			{settings.length === 0 ? (
				<p className="text-gray-400">
					У вас нет активных настроек уведомлений.
				</p>
			) : (
				<ul className="space-y-4">
					{settings.map(setting => (
						<li
							key={setting.setting_id}
							className="bg-gray-800 p-4 rounded flex justify-between items-center"
						>
							<div>
								<p>
									<strong>Тип элемента:</strong>{' '}
									{setting.item_type}
								</p>
								<p>
									<strong>Тип напоминания:</strong>{' '}
									{setting.reminder_type}
								</p>
								<p>
									<strong>Время напоминаний:</strong>{' '}
									{setting.reminder_times}
								</p>
							</div>
							<div className="flex space-x-2">
								<button
									onClick={() => handleUpdateClick(setting)}
									className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded"
								>
									Обновить
								</button>
								<button
									onClick={() => onDelete(setting.setting_id)}
									className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
								>
									Удалить
								</button>
							</div>
						</li>
					))}
				</ul>
			)}

			{/* Модальное окно */}
			{isModalOpen && currentSetting && (
				<UpdateModal
					setting={currentSetting}
					onClose={handleModalClose}
					onSave={handleSaveChanges}
				/>
			)}
		</div>
	)
}

export default NotificationSettingsList
