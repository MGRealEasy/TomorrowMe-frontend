import '@mobiscroll/react/dist/css/mobiscroll.min.css'
import {
	Eventcalendar,
	MbscCalendarEvent,
	MbscEventcalendarView,
	MbscEventClickEvent,
	setOptions,
	Toast,
	Popup,
	Input,
	Button,
	Datepicker,
	MbscEventCreatedEvent,
	MbscEventUpdatedEvent,
	MbscEventDeletedEvent,
} from '@mobiscroll/react'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
	fetchSchedulesByUserId,
	createSchedule,
	updateSchedule,
	deleteSchedule,
	Schedule,
	ScheduleData,
} from '../api/schedules'
import RingLoader from 'react-spinners/RingLoader'
import TaskList from '../components/TaskList'

setOptions({
	theme: 'ios',
	themeVariant: 'dark',
})

const ScheduleCalendar: FC = () => {
	const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([])
	const [isToastOpen, setToastOpen] = useState<boolean>(false)
	const [toastText, setToastText] = useState<string>('')

	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [tempEvent, setTempEvent] = useState<MbscCalendarEvent>({
		start: new Date(),
		end: new Date(),
	})
	const [isPopupOpen, setPopupOpen] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	// Get the tg object
	const tg = (window as any).Telegram.WebApp
	const user = tg.initDataUnsafe.user
	const userId = user ? Number(user.id) : 1148831907 // Replace with an appropriate default value or handle missing user.id

	useEffect(() => {
		console.log('useEffect')
		const getSchedules = async () => {
			if (!userId) {
				console.error('User ID not found')
				setIsLoading(false)
				return
			}

			try {
				const schedules: Schedule[] = await fetchSchedulesByUserId(
					userId
				)
				const events: MbscCalendarEvent[] = schedules.map(schedule => ({
					id: schedule.schedule_id,
					start: schedule.date
						? new Date(`${schedule.date}T${schedule.time_frame}`)
						: new Date(),
					end: schedule.date
						? new Date(`${schedule.date}T${schedule.time_frame}`)
						: new Date(),
					title: schedule.activity,
					description: `Importance: ${
						schedule.importance || 'Normal'
					}`,
				}))
				setEvents(events)
			} catch (error) {
				console.error('Error fetching schedules:', error)
				setToastText('Error loading schedules')
				setToastOpen(true)
			} finally {
				setIsLoading(false)
			}
		}

		getSchedules()
	}, [userId])

	const handleToastClose = useCallback(() => {
		setToastOpen(false)
	}, [])

	const handleEventClick = useCallback((args: MbscEventClickEvent) => {
		setTempEvent({ ...args.event })
		setIsEdit(true)
		setPopupOpen(true)
	}, [])

	const handleEventCreated = useCallback((args: MbscEventCreatedEvent) => {
		const event = args.event
		setTempEvent({
			...event,
			start: event.start ? parseDate(event.start) : new Date(),
			end: event.end ? parseDate(event.end) : new Date(),
		})
		setIsEdit(false)
		setPopupOpen(true)
	}, [])

	const handleEventUpdated = useCallback((args: MbscEventUpdatedEvent) => {
		setEvents(prevEvents =>
			prevEvents.map(event =>
				event.id === args.event.id ? args.event : event
			)
		)
	}, [])

	const handleEventDeleted = useCallback(
		async (args: MbscEventDeletedEvent) => {
			const deletedEvent = args.event

			try {
				if (
					deletedEvent.id !== undefined &&
					typeof deletedEvent.id === 'number'
				) {
					await deleteSchedule(userId, deletedEvent.id)
					setEvents(prevEvents =>
						prevEvents.filter(event => event.id !== deletedEvent.id)
					)
					setToastText('Schedule deleted')
					setToastOpen(true)
				} else {
					throw new Error('Invalid schedule ID')
				}
			} catch (error) {
				console.error('Error deleting schedule:', error)
				setToastText('Error deleting schedule')
				setToastOpen(true)
			}
		},
		[userId]
	)

	const handlePopupClose = useCallback(() => {
		setPopupOpen(false)
	}, [])

	const parseDate = (date: any): Date => {
		if (date instanceof Date) {
			return date
		} else if (typeof date === 'string' || typeof date === 'number') {
			return new Date(date)
		} else if (date && typeof date === 'object' && 'value' in date) {
			// If the object has a 'value' property, use it
			return new Date(date.value)
		} else {
			// If nothing matches, return the current date
			return new Date()
		}
	}

	const handleEventSave = useCallback(async () => {
		if (!userId) {
			console.error('User ID not found')
			return
		}

		const date =
			tempEvent.start &&
			(typeof tempEvent.start === 'string' ||
				tempEvent.start instanceof Date)
				? new Date(tempEvent.start).toISOString().split('T')[0]
				: ''

		const time_frame =
			tempEvent.start &&
			(typeof tempEvent.start === 'string' ||
				tempEvent.start instanceof Date)
				? new Date(tempEvent.start).toTimeString().split(' ')[0]
				: ''

		if (isEdit) {
			try {
				const scheduleId: number = tempEvent.id as number
				const scheduleData: Partial<ScheduleData> = {
					activity: tempEvent.title || 'No activity',
					date: date,
					time_frame: time_frame,
					// Add other fields as needed
				}
				await updateSchedule(userId, scheduleId, scheduleData)
				handleEventUpdated({
					event: tempEvent,
				} as MbscEventUpdatedEvent)
				setToastText('Schedule updated')
				setToastOpen(true)
			} catch (error) {
				console.error('Error updating schedule:', error)
				setToastText('Error updating schedule')
				setToastOpen(true)
			}
		} else {
			try {
				const scheduleData: ScheduleData = {
					activity: tempEvent.title || 'No activity',
					date: date,
					time_frame: time_frame,
					// Add other fields as needed
				}
				const response = await createSchedule(userId, scheduleData)
				const savedSchedule = response
				setEvents(prevEvents => [
					...prevEvents,
					{
						id: savedSchedule.schedule_id,
						start: new Date(
							`${savedSchedule.date}T${savedSchedule.time_frame}`
						),
						end: new Date(
							`${savedSchedule.date}T${savedSchedule.time_frame}`
						),
						title: savedSchedule.activity,
						description: `Importance: ${
							savedSchedule.importance || 'Normal'
						}`,
					},
				])
				setToastText('Schedule created')
				setToastOpen(true)
			} catch (error) {
				console.error('Error creating schedule:', error)
				setToastText('Error creating schedule')
				setToastOpen(true)
			}
		}
		setPopupOpen(false)
	}, [tempEvent, isEdit, handleEventUpdated, userId])

	const view = useMemo<MbscEventcalendarView>(
		() => ({
			calendar: { labels: true },
		}),
		[]
	)

	return (
		<>
			<div style={{ zIndex: -1 }}>
				{isLoading ? (
					<div className="flex justify-center items-center py-4 min-h-screen -mt-20">
						<RingLoader color="#00df9a" size={60} />
					</div>
				) : (
					<>
						<Eventcalendar
							clickToCreate="double"
							dragToCreate={true}
							dragToMove={true}
							dragToResize={true}
							eventDelete={true}
							data={myEvents}
							view={view}
							onEventClick={handleEventClick}
							onEventCreated={handleEventCreated}
							onEventDeleted={handleEventDeleted}
						/>

						<Popup
							isOpen={isPopupOpen}
							onClose={handlePopupClose}
							display="center"
							contentPadding={false}
							headerText={
								isEdit ? 'Edit Schedule' : 'New Schedule'
							}
						>
							<div className="mbsc-form-group">
								<Input
									label="Activity"
									value={tempEvent.title || ''}
									onChange={(
										ev: React.ChangeEvent<HTMLInputElement>
									) =>
										setTempEvent(prevTempEvent => ({
											...prevTempEvent,
											title: ev.target.value,
										}))
									}
								/>
								<Input
									label="Importance"
									value={
										tempEvent.description
											? tempEvent.description.replace(
													'Importance: ',
													''
											  )
											: ''
									}
									onChange={(
										ev: React.ChangeEvent<HTMLInputElement>
									) =>
										setTempEvent(prevTempEvent => ({
											...prevTempEvent,
											description: `Importance: ${ev.target.value}`,
										}))
									}
								/>
								<Datepicker
									label="Date & Time"
									value={tempEvent.start}
									onChange={(ev: any) =>
										setTempEvent(prevTempEvent => ({
											...prevTempEvent,
											start: ev.value,
											end: ev.value, // Assuming the schedule is at a specific time
										}))
									}
									touchUi={true}
									controls={['datetime']}
									dateFormat="YYYY-MM-DD"
									timeFormat="HH:mm"
								/>
							</div>
							<div className="mbsc-button-group">
								<Button
									onClick={handleEventSave}
									color="primary"
								>
									Save
								</Button>
								<Button onClick={handlePopupClose}>
									Cancel
								</Button>
							</div>
						</Popup>

						<Toast
							message={toastText}
							isOpen={isToastOpen}
							onClose={handleToastClose}
						/>
					</>
				)}
			</div>
			<TaskList />
		</>
	)
}

export default ScheduleCalendar
