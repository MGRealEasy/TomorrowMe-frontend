import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GoalList from '../pages/GoalList'
import Сalendar from '../pages/Сalendar'
import HabitList from '../pages/HabitsList'
import ProfilePage from '../pages/ProfilePage'

const AppRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Сalendar />} />
			<Route path="/goals" element={<GoalList />} />
			<Route path="/habits" element={<HabitList />} />
			<Route path="/profile" element={<ProfilePage />} />
		</Routes>
	)
}

export default AppRoutes
