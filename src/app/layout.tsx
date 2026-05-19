'use client';

import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '../../store';
import AuthLayoutWrapper from '@/components/AppLayout';
import { useSocket } from '@/hooks/useSocket';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	useSocket();
	return (
		<html lang='en'>
			<body className='antialiased'>
				<Provider store={store}>
					<AuthLayoutWrapper>{children}</AuthLayoutWrapper>
					<ToastContainer />
				</Provider>
			</body>
		</html>
	);
}
