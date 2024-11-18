import axios from 'axios'

export const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	// baseURL: 'https://tomorrowme-ed751e363316.herokuapp.com/api',
})
