import React, { createContext, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [progress, setProgress] = useState(0);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isOverlay, setIsOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: 'success'
	});

	// success
	// error
	// warning

	// const showNotification = (message, type = 'success') => {
	// 	setNotification({
	// 		show: true,
	// 		message,
	// 		type
	// 	});

	// 	setTimeout(() => {
	// 		setNotification({
	// 			...notification,
	// 			show: false
	// 		});
	// 	}, 3000);
	// };

	const showNotification = (message, type = 'success') => {
		setNotification({
			show: true,
			message,
			type
		});

		setTimeout(() => {
			setNotification(prev => ({
				...prev,
				show: false
			}));
		}, 3000);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setNotification(prev => ({
			...prev,
			show: false
		}));
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const handleOverlayClick = () => {
		setIsSidebarOpen(!isSidebarOpen);
		document.body.style.overflow = "";
	};

	// Close alert box
	// const handleClose = (event, reason) => {
	// 	if (reason === 'clickaway') {
	// 		return;
	// 	}

	// 	setAlertBox({
	// 		open: false
	// 	})
	// }

	const values = {
		progress,
		isSidebarOpen,
		setIsSidebarOpen,
		isOverlay,
		isLoading,
		setIsLoading,
		setIsOverlay,
		handleOverlayClick,
		handleClose,
		toggleSidebar,
		showNotification
	}

	return (
		<AppContext.Provider value={values}>
			{notification.show && (
				<div className={`notification ${notification.type} show`}>
					<FontAwesomeIcon 
						icon={notification.type === 'error' ? faExclamationCircle : faCheckCircle} 
					/>
					<span>{notification.message}</span>
				</div>
			)}
			{children}
		</AppContext.Provider>
	);
};


// Custom hook for easy access
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}