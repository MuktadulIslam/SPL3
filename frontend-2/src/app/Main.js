'use client';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Main({ children }) {
    return (
        <main className='w-full h-full'>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </main>
    );
}