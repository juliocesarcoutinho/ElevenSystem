'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Dashboard from './pages/dashboard/page';

const PaginaInicial = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('authToken');
            router.push('/auth/login');
        }
    }, [router]);

    // Função para verificar se o token está expirado
    const isTokenExpired = (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (e) {
            return true;
        }
    };

    // Se o token for válido, renderiza o Dashboard
    return <Dashboard />;
};

export default PaginaInicial;
