import React, { useEffect, useState } from 'react'
import {
	fetchGoalsByUserId,
	createGoal,
	updateGoal,
	deleteGoal,
	Goal,
	GoalData,
} from '../api/goals'
import RingLoader from 'react-spinners/RingLoader'

const GoalList: React.FC = () => {
	const [goals, setGoals] = useState<Goal[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const [newGoal, setNewGoal] = useState<Partial<GoalData>>({
		goal_number: 1,
		goal_type: '',
		goal_description: '',
		start_date: '',
		end_date: '',
		importance: undefined,
		is_completed: false,
		is_active: true,
		custom_field: '',
	})

	const [editingGoalId, setEditingGoalId] = useState<number | null>(null)
	const [editedGoal, setEditedGoal] = useState<Partial<GoalData>>({})

	// Get the tg object
	const tg = (window as any).Telegram.WebApp
	const user = tg.initDataUnsafe.user
	const tguser_id = user ? Number(user.id) : 1148831907

	useEffect(() => {
		const getGoals = async () => {
			if (!tguser_id) {
				console.error('tguser_id not found')
				setError('User not found')
				setLoading(false)
				return
			}
			try {
				const goalsData = await fetchGoalsByUserId(tguser_id)
				setGoals(goalsData)
			} catch (error) {
				console.error('Error fetching goals:', error)
				setError('Error loading goals')
			} finally {
				setLoading(false)
			}
		}
		getGoals()
	}, [tguser_id])

	const handleCreateGoal = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			const createdGoal = await createGoal(tguser_id, newGoal as GoalData)
			setGoals([...goals, createdGoal])
			// Clear the form
			setNewGoal({
				goal_number: (newGoal.goal_number || 1) + 1,
				goal_type: '',
				goal_description: '',
				start_date: '',
				end_date: '',
				importance: undefined,
				is_completed: false,
				is_active: true,
				custom_field: '',
			})
		} catch (error) {
			console.error('Error creating goal:', error)
			setError('Error creating goal')
		}
	}

	const handleUpdateGoal = async (
		e: React.FormEvent<HTMLFormElement>,
		goalId: number
	) => {
		e.preventDefault()
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			const updatedGoal = await updateGoal(
				tguser_id,
				goalId,
				editedGoal as GoalData
			)
			setGoals(
				goals.map(goal =>
					goal.goal_id === goalId ? updatedGoal : goal
				)
			)
			setEditingGoalId(null)
			setEditedGoal({})
		} catch (error) {
			console.error('Error updating goal:', error)
			setError('Error updating goal')
		}
	}

	const handleDeleteGoal = async (goalId: number) => {
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			await deleteGoal(tguser_id, goalId)
			setGoals(goals.filter(goal => goal.goal_id !== goalId))
		} catch (error) {
			console.error('Error deleting goal:', error)
			setError('Error deleting goal')
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen -mt-20">
				<RingLoader color="#00df9a" size={60} />
			</div>
		)
	}

	return (
		<div className="flex justify-center items-start min-h-screen">
			<div className="max-w-4xl w-full mx-auto p-6 rounded-lg shadow-lg">
				<h1 className="text-2xl font-bold mb-6 text-center text-white">
					My Goals
				</h1>

				{/* Form for creating a new goal */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4 text-white">
						Create New Goal
					</h2>
					<form
						onSubmit={handleCreateGoal}
						className="bg-gray-600 shadow-md rounded-lg p-6"
					>
						<div className="mb-4">
							<label className="block text-white mb-2">
								Goal Description
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={newGoal.goal_description || ''}
								onChange={e =>
									setNewGoal({
										...newGoal,
										goal_description: e.target.value,
									})
								}
								required
							/>
						</div>
						{/* Add other fields as needed */}
						<div className="mb-4">
							<label className="block text-white mb-2">
								Goal Type
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={newGoal.goal_type || ''}
								onChange={e =>
									setNewGoal({
										...newGoal,
										goal_type: e.target.value,
									})
								}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-white mb-2">
								Importance
							</label>
							<input
								type="number"
								className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={newGoal.importance || ''}
								onChange={e =>
									setNewGoal({
										...newGoal,
										importance: Number(e.target.value),
									})
								}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-white mb-2">
								Start Date
							</label>
							<input
								type="date"
								className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={newGoal.start_date || ''}
								onChange={e =>
									setNewGoal({
										...newGoal,
										start_date: e.target.value || undefined,
									})
								}
							/>
						</div>
						<div className="mb-6">
							<label className="block text-white mb-2">
								End Date
							</label>
							<input
								type="date"
								className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
								value={newGoal.end_date || ''}
								onChange={e =>
									setNewGoal({
										...newGoal,
										end_date: e.target.value || undefined,
									})
								}
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
						>
							Create
						</button>
					</form>
				</div>

				{/* Display error message if exists */}
				{error && (
					<div className="mb-6 text-center text-red-500">{error}</div>
				)}

				{/* Display message if no goals */}
				{goals.length === 0 ? (
					<div className="text-center text-white text-lg">
						You have no current goals.
					</div>
				) : (
					<ul className="space-y-6">
						{goals.map(goal => (
							<li
								key={goal.goal_id}
								className="bg-gray-600 shadow-md rounded-lg p-6"
							>
								{editingGoalId === goal.goal_id ? (
									// Edit form
									<form
										onSubmit={e =>
											handleUpdateGoal(e, goal.goal_id)
										}
									>
										<div className="mb-4">
											<label className="block text-white mb-2">
												Goal Description
											</label>
											<input
												type="text"
												className="w-full px-3 py-2 border border-gray-500 rounded bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
												value={
													editedGoal.goal_description ||
													goal.goal_description
												}
												onChange={e =>
													setEditedGoal({
														...editedGoal,
														goal_description:
															e.target.value,
													})
												}
												required
											/>
										</div>
										{/* Add other fields as needed */}
										<button
											type="submit"
											className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition duration-200"
										>
											Save
										</button>
										<button
											type="button"
											onClick={() =>
												setEditingGoalId(null)
											}
											className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
										>
											Cancel
										</button>
									</form>
								) : (
									// Regular display
									<>
										<h2 className="text-xl font-semibold text-white">
											{goal.goal_description}
										</h2>
										<div className="mt-4">
											<p className="text-gray-300">
												<span className="font-medium">
													Goal Type:
												</span>{' '}
												{goal.goal_type ||
													'Not specified'}
											</p>
											<p className="text-gray-300">
												<span className="font-medium">
													Importance:
												</span>{' '}
												{goal.importance ||
													'Not specified'}
											</p>
											<p className="text-gray-300">
												<span className="font-medium">
													Period:
												</span>{' '}
												{goal.start_date
													? new Date(
															goal.start_date
													  ).toLocaleDateString()
													: 'Not specified'}{' '}
												-{' '}
												{goal.end_date
													? new Date(
															goal.end_date
													  ).toLocaleDateString()
													: 'Not specified'}
											</p>
											<p className="text-gray-300">
												<span className="font-medium">
													Status:
												</span>{' '}
												{goal.is_completed
													? 'Completed'
													: 'In Progress'}{' '}
												|{' '}
												{goal.is_active
													? 'Active'
													: 'Inactive'}
											</p>
										</div>
										<div className="mt-6 flex space-x-4">
											<button
												onClick={() => {
													setEditingGoalId(
														goal.goal_id
													)
													setEditedGoal(goal) // Populate form with current data
												}}
												className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
											>
												Edit
											</button>
											<button
												onClick={() =>
													handleDeleteGoal(
														goal.goal_id
													)
												}
												className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
											>
												Delete
											</button>
										</div>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}

export default GoalList
