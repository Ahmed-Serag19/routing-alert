import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { TodoProvider } from '../context/TodoContext';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Routing Alert',
  description: 'Routing alert before saving data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>
          <Navbar />
          <TodoProvider>{children}</TodoProvider>
        </>
      </body>
    </html>
  );
}
