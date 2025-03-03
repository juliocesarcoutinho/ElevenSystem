/* eslint-disable @next/next/no-img-element */

import React, {useContext} from 'react';
import AppMenuitem from './AppMenuitem';
import {LayoutContext} from './context/layoutcontext';
import {MenuProvider} from './context/menucontext';
import {AppMenuItem} from '@/types';

const AppMenu = () => {
    const {layoutConfig} = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                {label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'}
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-users',
            items: [
                {label: 'Pessoas / Usuarios', icon: 'pi pi-fw pi-user', to: '/pages/people'}
            ]
        },

        {
            label: '',
            items: [
                {label: 'Mensagens', icon: 'pi pi-fw pi-book', to: '/pages/messages'}
            ]
        },

        {
            label: '',
            items: [
                {label: 'Eventos', icon: 'pi pi-fw pi-calendar', to: '/pages/events'}
            ]
        },

        {
            label: '',
            items: [
                {label: 'Chat', icon: 'pi pi-whatsapp', to: '/pages/chat'}
            ]
        },

        {
            label: '',
            icon: 'pi pi-fw pi-bookmark',
            items: [
                {label: 'Usuários', icon: 'pi pi-fw pi-user', to: '/pages/users'}
            ]
        },

    ];
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label || `menu-item-${i}`}/>
                    ) : (
                        <li className="menu-separator" key={`separator-${i}`}></li>
                    );
                })}
            </ul>
        </MenuProvider>
    );

};

export default AppMenu;
