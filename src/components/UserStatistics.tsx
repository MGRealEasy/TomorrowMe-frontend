// src/components/UserStatistics.tsx

import React, { useEffect, useState } from 'react'
import { fetchUserStatistics, UserStatistic } from '../api/user'
import { useTelegramUser } from '../hooks/useTelegramUser'
import { RingLoader } from 'react-spinners'

const UserStatistics: React.FC = () => {
	const [statistics, setStatistics] = useState<UserStatistic[]>([])
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

		const loadStatistics = async () => {
			try {
				const stats = await fetchUserStatistics(tguser_id)
				setStatistics(stats)
			} catch (err) {
				console.error('Error fetching user statistics:', err)
				setError('Error loading statistics')
			} finally {
				setIsLoading(false)
			}
		}

		loadStatistics()
	}, [tguser_id])

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<RingLoader color="#00df9a" size={30} />
			</div>
		)
	}

	if (error) {
		return <div className="text-red-500">{error}</div>
	}

	return (
		<div className="text-white p-4">
			<h2 className="text-2xl font-bold mb-4">User Statistics</h2>
			{statistics.length === 0 ? (
				<p>No statistics available.</p>
			) : (
				<table className="w-full text-left">
					<thead>
						<tr>
							<th className="border-b-2 border-gray-600 pb-2">
								Date
							</th>
							<th className="border-b-2 border-gray-600 pb-2">
								Tasks Completed
							</th>
							<th className="border-b-2 border-gray-600 pb-2">
								Tasks Pending
							</th>
							<th className="border-b-2 border-gray-600 pb-2">
								Habits
							</th>
							<th className="border-b-2 border-gray-600 pb-2">
								Productivity
							</th>
						</tr>
					</thead>
					<tbody>
						{statistics.map(stat => (
							<tr key={stat.statistics_id}>
								<td className="py-2">
									{new Date(stat.date).toLocaleDateString()}
								</td>
								<td className="py-2">{stat.tasks_completed}</td>
								<td className="py-2">{stat.tasks_pending}</td>
								<td className="py-2">{stat.habits_followed}</td>
								<td className="py-2">
									{stat.productivity_score}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default UserStatistics
