// src/hooks/useTelegramUser.ts

import { useEffect, useState } from 'react'

interface TelegramUser {
	id: number
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
}

export const useTelegramUser = (): TelegramUser | null => {
	const [user, setUser] = useState<TelegramUser | null>(null)

	useEffect(() => {
		const tg = (window as any).Telegram?.WebApp || 1148831907
		if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
			setUser(tg.initDataUnsafe.user)
		} else {
			setUser(null)
		}
	}, [])

	return user
}
