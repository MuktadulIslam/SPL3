'use client';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Main({ children }) {
    return (
        <main>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </main>
    );
}