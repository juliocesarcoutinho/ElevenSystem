'use client';
import {LayoutProvider} from '@/layout/context/layoutcontext';
import {PrimeReactProvider} from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../app/global.css'

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
        <head>
            <link id="theme-css" href={`/themes/vela-orange/theme.css`} rel="stylesheet"></link>
        </head>
        <body>
        <PrimeReactProvider>
            <LayoutProvider>{children}</LayoutProvider>
        </PrimeReactProvider>
        </body>
        </html>
    );
}
