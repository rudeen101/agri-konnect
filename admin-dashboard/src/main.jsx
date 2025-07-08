import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<BrowserRouter>
		<AppProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</AppProvider>
	</BrowserRouter>,
);
