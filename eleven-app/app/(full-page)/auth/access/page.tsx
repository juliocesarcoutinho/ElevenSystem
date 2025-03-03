/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '@/layout/context/layoutcontext';

const AccessDeniedPage = () => {
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <h1 className="text-900 font-bold text-5xl mb-2">System Pet TopOne</h1>
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                    alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                         style={{ borderRadius: '53px' }}>

                        <h1 className="text-900 font-bold text-5xl mb-2">Acesso negado</h1>
                        <div className="text-600 mb-5">Você não tem as permissões necessárias.</div>
                        <img src="/demo/images/access/asset-access.svg" alt="Error" className="mb-5" width="80%" />
                        <Button icon="pi pi-arrow-left" label="Ir para a dashboard" text
                                onClick={() => router.push('/')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;
