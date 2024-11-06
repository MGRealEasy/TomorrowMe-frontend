// src/components/UserProfile.tsx

import React, { useEffect, useState } from 'react'
import { fetchUserByTelegramId, updateUser, User } from '../api/user'
import { useTelegramUser } from '../hooks/useTelegramUser'

const UserProfile: React.FC = () => {
	const [userData, setUserData] = useState<User | null>(null)
	const [editMode, setEditMode] = useState<boolean>(false)
	const [formData, setFormData] = useState<Partial<User>>({})
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const tgUser = useTelegramUser()
	const tguser_id = tgUser ? Number(tgUser.id) : 1148831907

	useEffect(() => {
		if (!tguser_id) {
			setError('User not found')
			setIsLoading(false)
			return
		}

		const loadUserData = async () => {
			try {
				const user = await fetchUserByTelegramId(tguser_id)
				setUserData(user)
				setFormData(user)
			} catch (err) {
				console.error('Error fetching user data:', err)
				setError('Error loading user data')
			} finally {
				setIsLoading(false)
			}
		}

		loadUserData()
	}, [tguser_id])

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: value,
		}))
	}

	const handleSave = async () => {
		if (!tguser_id) return
		try {
			const updatedUser = await updateUser(tguser_id, formData)
			setUserData(updatedUser)
			setEditMode(false)
		} catch (err) {
			console.error('Error updating user data:', err)
			setError('Error updating user data')
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen -mt-20">
				{/* <RingLoader color="#00df9a" size={30} /> */}
			</div>
		)
	}

	if (error) {
		return <div className="text-red-500">{error}</div>
	}

	return (
		<div className="text-white p-4">
			<h2 className="text-2xl font-bold mb-4">User Profile</h2>
			{userData && (
				<div>
					{editMode ? (
						<div className="space-y-4">
							<div>
								<label className="block">First Name:</label>
								<input
									className="bg-gray-800 text-white p-2 w-full"
									type="text"
									name="first_name"
									value={formData.first_name || ''}
									onChange={handleInputChange}
								/>
							</div>
							<div>
								<label className="block">Last Name:</label>
								<input
									className="bg-gray-800 text-white p-2 w-full"
									type="text"
									name="last_name"
									value={formData.last_name || ''}
									onChange={handleInputChange}
								/>
							</div>
							{/* Add other fields similarly */}
							<button
								className="bg-green-500 text-white px-4 py-2 mt-4"
								onClick={handleSave}
							>
								Save
							</button>
							<button
								className="bg-red-500 text-white px-4 py-2 mt-4 ml-2"
								onClick={() => setEditMode(false)}
							>
								Cancel
							</button>
						</div>
					) : (
						<div className="space-y-2">
							<p>
								<strong>First Name:</strong>{' '}
								{userData.first_name || 'Not specified'}
							</p>
							<p>
								<strong>Last Name:</strong>{' '}
								{userData.last_name || 'Not specified'}
							</p>
							{/* Add other fields similarly */}
							<button
								className="bg-blue-500 text-white px-4 py-2 mt-4"
								onClick={() => setEditMode(true)}
							>
								Edit Profile
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default UserProfile
