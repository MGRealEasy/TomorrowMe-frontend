import { useState } from 'react'
import {
	NotificationSetting,
	NotificationSettingData,
} from '../api/notificationService'

interface UpdateModalProps {
	setting: NotificationSetting
	onClose: () => void
	onSave: (updatedData: Partial<NotificationSettingData>) => void
}

const UpdateModal: React.FC<UpdateModalProps> = ({
	setting,
	onClose,
	onSave,
}) => {
	const [itemType, setItemType] = useState(setting.item_type)
	const [reminderTimes, setReminderTimes] = useState(setting.reminder_times)

	const handleSave = () => {
		const updatedData = {
			item_type: itemType,
			reminder_times: reminderTimes,
		}
		onSave(updatedData)
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
			<div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl border border-gray-700 w-96">
				<h2 className="text-lg font-semibold mb-4 text-center">
					Обновить уведомление
				</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 text-gray-300">
						Тип элемента:
					</label>
					<select
						value={itemType}
						onChange={e => setItemType(e.target.value)}
						className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="schedule">Schedule</option>
						<option value="task">Task</option>
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1 text-gray-300">
						Время напоминаний (JSON формат):
					</label>
					<textarea
						value={reminderTimes}
						onChange={e => setReminderTimes(e.target.value)}
						className="w-full border border-gray-600 bg-gray-800 text-gray-200 rounded px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-all duration-200"
					>
						Отмена
					</button>
					<button
						onClick={handleSave}
						className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-all duration-200 shadow-md hover:shadow-lg"
					>
						Сохранить
					</button>
				</div>
			</div>
		</div>
	)
}

export default UpdateModal
