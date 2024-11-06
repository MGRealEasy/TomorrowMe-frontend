import React, { useState, useRef, useEffect } from 'react'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
	// State to manage the navbar's visibility
	const [nav, setNav] = useState(false)

	// Reference for the mobile menu
	const navRef = useRef<HTMLUListElement>(null)

	// Toggle function to handle the navbar's display
	const handleNav = () => {
		setNav(!nav)
	}

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				navRef.current &&
				!navRef.current.contains(event.target as Node)
			) {
				setNav(false)
			}
		}

		// Add event listener when nav is open
		if (nav) {
			document.addEventListener('mousedown', handleClickOutside)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
		}

		// Cleanup event listener on component unmount
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [nav])

	// Array containing navigation items
	const navItems = [
		{ id: 1, text: 'Home', path: '/' },
		{ id: 2, text: 'Goals', path: '/goals' },
		{ id: 3, text: 'Habits', path: '/habits' },
		{ id: 4, text: 'Profile', path: '/profile' },
	]

	return (
		<div className="bg-black flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
			{/* Logo */}
			<Link to="/" className="w-full text-3xl font-bold text-[#00df9a]">
				TomorrowMe
			</Link>

			{/* Desktop Navigation */}
			<ul className="hidden md:flex">
				{navItems.map(item => (
					<Link
						to={item.path}
						key={item.id}
						className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
					>
						<span>{item.text}</span>
					</Link>
				))}
			</ul>

			{/* Mobile Navigation Icon */}
			<div onClick={handleNav} className="block md:hidden">
				{nav ? (
					<AiOutlineClose size={20} />
				) : (
					<AiOutlineMenu size={20} />
				)}
			</div>

			{/* Mobile Navigation Menu */}
			<ul
				ref={navRef}
				className={
					nav
						? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50'
						: 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-50'
				}
			>
				{/* Mobile Logo */}
				<h1 className="w-full text-2xl font-bold text-[#00df9a] m-4">
					TomorrowMe
				</h1>

				{/* Mobile Navigation Items */}
				{navItems.map(item => (
					<li
						key={item.id}
						className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
					>
						<Link to={item.path} onClick={() => setNav(false)}>
							{item.text}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Navbar
