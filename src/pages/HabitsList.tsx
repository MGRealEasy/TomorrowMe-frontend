import React, { useEffect, useState } from 'react'
import {
	fetchHabitsByUserId,
	createHabit,
	updateHabit,
	deleteHabit,
	Habit,
	HabitData,
} from '../api/habits'
import RingLoader from 'react-spinners/RingLoader'

const HabitList: React.FC = () => {
	const [habits, setHabits] = useState<Habit[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const [newHabit, setNewHabit] = useState<Partial<HabitData>>({
		habit_number: 1,
		habit_description: '',
		habit_type: '',
		start_date: '',
		importance: undefined,
		is_active: true,
		custom_field: '',
	})

	const [editingHabitId, setEditingHabitId] = useState<number | null>(null)
	const [editedHabit, setEditedHabit] = useState<Partial<HabitData>>({})

	// Get the tg object
	const tg = (window as any).Telegram.WebApp
	const user = tg.initDataUnsafe.user
	const tguser_id = user ? Number(user.id) : 1148831907

	useEffect(() => {
		const getHabits = async () => {
			if (!tguser_id) {
				console.error('tguser_id not found')
				setError('User not found')
				setLoading(false)
				return
			}
			try {
				const habitsData = await fetchHabitsByUserId(tguser_id)
				setHabits(habitsData)
			} catch (error) {
				console.error('Error fetching habits:', error)
				setError('Error loading habits')
			} finally {
				setLoading(false)
			}
		}
		getHabits()
	}, [tguser_id])

	const handleCreateHabit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			const createdHabit = await createHabit(
				tguser_id,
				newHabit as HabitData
			)
			setHabits([...habits, createdHabit])
			// Clear the form
			setNewHabit({
				habit_number: (newHabit.habit_number || 1) + 1,
				habit_description: '',
				habit_type: '',
				start_date: '',
				importance: undefined,
				is_active: true,
				custom_field: '',
			})
		} catch (error) {
			console.error('Error creating habit:', error)
			setError('Error creating habit')
		}
	}

	const handleUpdateHabit = async (
		e: React.FormEvent<HTMLFormElement>,
		habitId: number
	) => {
		e.preventDefault()
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			const updatedHabit = await updateHabit(
				tguser_id,
				habitId,
				editedHabit as HabitData
			)
			setHabits(
				habits.map(habit =>
					habit.habit_id === habitId ? updatedHabit : habit
				)
			)
			setEditingHabitId(null)
			setEditedHabit({})
		} catch (error) {
			console.error('Error updating habit:', error)
			setError('Error updating habit')
		}
	}

	const handleDeleteHabit = async (habitId: number) => {
		if (!tguser_id) {
			console.error('tguser_id not found')
			setError('User not found')
			return
		}
		try {
			await deleteHabit(tguser_id, habitId)
			setHabits(habits.filter(habit => habit.habit_id !== habitId))
		} catch (error) {
			console.error('Error deleting habit:', error)
			setError('Error deleting habit')
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen -mt-20">
				<RingLoader color="#00df9a" size={60} />
			</div>
		)
	}

	if (error) {
		return <div className="text-center text-red-500 py-4">{error}</div>
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 text-white">My Habits</h1>

			{/* Form for creating a new habit */}
			<div className="mb-6">
				<h2 className="text-xl font-semibold mb-2 text-white">
					Create New Habit
				</h2>
				<form
					onSubmit={handleCreateHabit}
					className="bg-white shadow-md rounded-lg p-4"
				>
					<div className="mb-4">
						<label className="block text-gray-700">
							Habit Description
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border rounded"
							value={newHabit.habit_description || ''}
							onChange={e =>
								setNewHabit({
									...newHabit,
									habit_description: e.target.value,
								})
							}
							required
						/>
					</div>
					{/* Add other fields as needed */}
					<div className="mb-4">
						<label className="block text-gray-700">
							Habit Type
						</label>
						<input
							type="text"
							className="w-full px-3 py-2 border rounded"
							value={newHabit.habit_type || ''}
							onChange={e =>
								setNewHabit({
									...newHabit,
									habit_type: e.target.value,
								})
							}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">
							Importance
						</label>
						<input
							type="number"
							className="w-full px-3 py-2 border rounded"
							value={newHabit.importance || ''}
							onChange={e =>
								setNewHabit({
									...newHabit,
									importance: Number(e.target.value),
								})
							}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">
							Start Date
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 border rounded"
							value={newHabit.start_date || ''}
							onChange={e =>
								setNewHabit({
									...newHabit,
									start_date: e.target.value || undefined,
								})
							}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Create
					</button>
				</form>
			</div>

			{habits.length === 0 ? (
				<p>You have no habits.</p>
			) : (
				<ul className="space-y-4">
					{habits.map(habit => (
						<li
							key={habit.habit_id}
							className="bg-white shadow-md rounded-lg p-4"
						>
							{editingHabitId === habit.habit_id ? (
								// Edit form
								<form
									onSubmit={e =>
										handleUpdateHabit(e, habit.habit_id)
									}
								>
									<div className="mb-4">
										<label className="block text-gray-700">
											Habit Description
										</label>
										<input
											type="text"
											className="w-full px-3 py-2 border rounded"
											value={
												editedHabit.habit_description ||
												habit.habit_description
											}
											onChange={e =>
												setEditedHabit({
													...editedHabit,
													habit_description:
														e.target.value,
												})
											}
											required
										/>
									</div>
									{/* Add other fields as needed */}
									<button
										type="submit"
										className="bg-green-500 text-white px-4 py-2 rounded mr-2"
									>
										Save
									</button>
									<button
										type="button"
										onClick={() => setEditingHabitId(null)}
										className="bg-gray-500 text-white px-4 py-2 rounded"
									>
										Cancel
									</button>
								</form>
							) : (
								// Regular display
								<>
									<h2 className="text-xl font-semibold">
										{habit.habit_description}
									</h2>
									<div className="mt-2">
										<p className="text-gray-600">
											<span className="font-medium">
												Habit Type:
											</span>{' '}
											{habit.habit_type ||
												'Not specified'}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Importance:
											</span>{' '}
											{habit.importance ||
												'Not specified'}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Start Date:
											</span>{' '}
											{habit.start_date
												? new Date(
														habit.start_date
												  ).toLocaleDateString()
												: 'Not specified'}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Status:
											</span>{' '}
											{habit.is_active
												? 'Active'
												: 'Inactive'}
										</p>
									</div>
									<div className="mt-4">
										<button
											onClick={() => {
												setEditingHabitId(
													habit.habit_id
												)
												setEditedHabit(habit) // Populate form with current data
											}}
											className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDeleteHabit(
													habit.habit_id
												)
											}
											className="bg-red-500 text-white px-4 py-2 rounded"
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
	)
}

export default HabitList
