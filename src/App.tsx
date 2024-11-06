import Navbar from './components/Navbar'
import './app.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

const App = () => {
	const tg = (window as any).Telegram.WebApp

	// Получаем информацию о пользователе
	const user = tg.initDataUnsafe.user

	// Получаем user_id
	const userId = user ? user.id : null
	return (
		<div>
			<Router>
				<Navbar />
				<AppRoutes />
				<h1>{userId}</h1>
			</Router>
		</div>
	)
}

export default App
