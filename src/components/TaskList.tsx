import React, { useEffect, useState } from 'react'
import {
	fetchTasksByUserId,
	createTask,
	updateTask,
	deleteTask,
	Task,
	TaskData,
} from '../api/tasks'
import { useTelegramUser } from '../hooks/useTelegramUser'
import { RingLoader } from 'react-spinners'

const TaskList: React.FC = () => {
	const [tasks, setTasks] = useState<Task[]>([])
	const [newTaskDescription, setNewTaskDescription] = useState('')
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	// Get tguser_id from Telegram WebApp
	const tgUser = useTelegramUser()
	const tguser_id = tgUser ? Number(tgUser.id) : 1148831907

	useEffect(() => {
		if (!tguser_id) {
			setError('User not found')
			setIsLoading(false)
			return
		}

		const loadTasks = async () => {
			try {
				const fetchedTasks = await fetchTasksByUserId(tguser_id)
				setTasks(fetchedTasks)
			} catch (err) {
				console.error('Error fetching tasks:', err)
				setError('Error loading tasks')
			} finally {
				setIsLoading(false)
			}
		}

		loadTasks()
	}, [tguser_id])

	const handleCreateTask = async () => {
		if (!tguser_id || !newTaskDescription.trim()) return

		try {
			const taskData: TaskData = {
				task_number: tasks.length + 1,
				task_description: newTaskDescription.trim(),
			}
			const newTask = await createTask(tguser_id, taskData)
			setTasks([...tasks, newTask])
			setNewTaskDescription('')
		} catch (err) {
			console.error('Error creating task:', err)
			setError('Error creating task')
		}
	}

	const handleToggleComplete = async (task: Task) => {
		if (!tguser_id) return

		try {
			const updatedTask = await updateTask(tguser_id, task.task_id, {
				is_completed: !task.is_completed,
			})
			setTasks(
				tasks.map(t => (t.task_id === task.task_id ? updatedTask : t))
			)
		} catch (err) {
			console.error('Error updating task:', err)
			setError('Error updating task')
		}
	}

	const handleDeleteTask = async (task_id: number) => {
		if (!tguser_id) return

		try {
			await deleteTask(tguser_id, task_id)
			setTasks(tasks.filter(t => t.task_id !== task_id))
		} catch (err) {
			console.error('Error deleting task:', err)
			setError('Error deleting task')
		}
	}

	const handleEditTask = async (task: Task, newDescription: string) => {
		if (!tguser_id) return

		try {
			const updatedTask = await updateTask(tguser_id, task.task_id, {
				task_description: newDescription,
			})
			setTasks(
				tasks.map(t => (t.task_id === task.task_id ? updatedTask : t))
			)
		} catch (err) {
			console.error('Error updating task:', err)
			setError('Error updating task')
		}
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<RingLoader color="#00df9a" size={30} />
			</div>
		)
	}

	if (error) {
		return <div className="text-white">{error}</div>
	}

	return (
		<div className="bg-black min-h-screen text-white p-4">
			<h2 className="text-2xl font-bold mb-4">My Tasks</h2>
			<ul className="space-y-4">
				{tasks.map(task => (
					<li
						key={task.task_id}
						className="flex items-center space-x-4"
					>
						<input
							type="checkbox"
							checked={task.is_completed}
							onChange={() => handleToggleComplete(task)}
							className="mr-2"
						/>
						<span
							className={`flex-1 ${
								task.is_completed ? 'line-through' : ''
							}`}
						>
							{task.task_description}
						</span>
						<button
							onClick={() => handleDeleteTask(task.task_id)}
							className="text-red-500 hover:text-red-700"
						>
							Delete
						</button>
						<button
							onClick={() => {
								const newDescription = prompt(
									'Enter new task description:',
									task.task_description
								)
								if (newDescription !== null) {
									handleEditTask(task, newDescription)
								}
							}}
							className="text-blue-500 hover:text-blue-700"
						>
							Edit
						</button>
					</li>
				))}
			</ul>

			<div className="mt-8">
				<h3 className="text-xl font-semibold mb-2">
					Create a new task
				</h3>
				<input
					type="text"
					value={newTaskDescription}
					onChange={e => setNewTaskDescription(e.target.value)}
					placeholder="Task description"
					className="bg-gray-800 text-white p-2 rounded w-full mb-2"
				/>
				<button
					onClick={handleCreateTask}
					className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
				>
					Add task
				</button>
			</div>
		</div>
	)
}

export default TaskList
