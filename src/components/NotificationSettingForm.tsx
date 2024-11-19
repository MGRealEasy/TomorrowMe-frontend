import React, { useState } from 'react'
import { NotificationSettingData } from '../api/notificationService'

interface NotificationSettingFormProps {
	initialData?: NotificationSettingData
	onSubmit: (data: NotificationSettingData) => void
}

const NotificationSettingForm: React.FC<NotificationSettingFormProps> = ({
	initialData,
	onSubmit,
}) => {
	const [formData, setFormData] = useState<NotificationSettingData>(
		initialData || {
			item_type: '',
			reminder_type: '',
			reminder_times: '',
		}
	)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formData)
		setFormData({
			item_type: '',
			reminder_type: '',
			reminder_times: '',
		})
	}

	return (
		<form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded mb-6">
			<div className="mb-4">
				<label className="block text-gray-200 mb-2">
					Тип элемента:
					<select
						name="item_type"
						value={formData.item_type}
						onChange={handleChange}
						required
						className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
					>
						<option value="" disabled>
							Выберите тип элемента
						</option>
						<option value="schedule">Schedule</option>
						<option value="task">Task</option>
					</select>
				</label>
			</div>

			{/* Добавьте дополнительные поля при необходимости */}

			<div className="mb-4">
				<label className="block text-gray-200 mb-2">
					Время напоминаний:
					<input
						type="text"
						name="reminder_times"
						value={formData.reminder_times}
						onChange={handleChange}
						required
						className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
					/>
				</label>
			</div>
			<button
				type="submit"
				className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
			>
				Сохранить
			</button>
		</form>
	)
}

export default NotificationSettingForm
