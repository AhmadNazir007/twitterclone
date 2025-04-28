'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '../../store';
import AuthLayoutWrapper from '@/components/AppLayout';
import { useSocket } from '@/hooks/useSocket';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	useSocket();
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Provider store={store}>
					<AuthLayoutWrapper>{children}</AuthLayoutWrapper>
					<ToastContainer />
				</Provider>
			</body>
		</html>
	);
}
