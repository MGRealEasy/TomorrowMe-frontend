import React from 'react'
import {
	NotificationSetting,
	NotificationSettingData,
} from '../api/notificationService'

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
									onClick={() =>
										onUpdate(setting.setting_id, {
											// Здесь можно открыть модальное окно для ввода новых данных
										})
									}
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
		</div>
	)
}

export default NotificationSettingsList
