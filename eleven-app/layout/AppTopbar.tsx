import Link from 'next/link';
import {classNames} from 'primereact/utils';
import React, {forwardRef, useContext, useImperativeHandle, useRef} from 'react';
import {LayoutContext} from './context/layoutcontext';
import {AppTopbarRef} from '@/types';
import {Button} from 'primereact/button';
import {useRouter} from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import {LoginService} from "@/demo/services/usuario/LoginService";
import UsuarioService from "@/demo/services/usuario/UsuarioService";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef<HTMLButtonElement>(null);
    const topbarmenuRef = useRef<HTMLDivElement>(null);
    const topbarmenubuttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const sair = () => {
        LoginService.logout();
        router.push('/auth/login');
    };

    // Função para decodificar o token e redirecionar o operators
    const redirecionarParaOperador = async () => {
        const token = localStorage.getItem(UsuarioService.CHAVE_TOKEN); // Obtém o token do localStorage no navegador
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token); // Decodifica o token
                const usuarioId = decodedToken.sub; // Extrai o ID do usuário a partir do campo 'sub' que esta denteo do token

                if (usuarioId) {
                    const usuario = await UsuarioService.getUsuarioById(usuarioId); // Busca o usuário logado baseado no ID
                    if (usuario) {
                        router.push(`/pages/operators?id=${usuario.id}`); // Redireciona para a página de operators com o ID do usuário
                    } else {
                        console.error('Usuário não encontrado');
                    }
                } else {
                    console.error('ID do usuário não encontrado no token');
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        } else {
            console.error('Token não encontrado');
        }
    };

    // Função para buscar o usuário pelo ID e redirecionar
    const buscarUsuario = async (usuarioId: number) => {
        try {
            const usuario = await UsuarioService.getUsuarioById(usuarioId);
            console.log("Usuário retornado pela API:", usuario); //Log pra ver se o users esta retornando
            if (usuario && usuario.name) {
                router.push(`/pages/operators?name=${encodeURIComponent(usuario.name)}`); // Redireciona com o nome do usuário
            } else {
                console.error('Nome do usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
        }
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <span>Eleven - Adm</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button"
                    onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button"
                    className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef}
                 className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <Button onClick={redirecionarParaOperador} rounded text severity="info" type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Operador</span>
                </Button>

                <Link href="/pages/configuracoes">
                    <Button rounded text severity="success" type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Configurações</span>
                    </Button>
                </Link>

                <Button onClick={sair} rounded text severity="danger" type="button"
                        className="p-link layout-topbar-button">
                    <i className="pi pi-fw pi-power-off"></i>
                    <span>Sair do sistema</span>
                </Button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
