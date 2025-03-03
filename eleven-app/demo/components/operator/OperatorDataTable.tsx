'use client';
import {useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Demo} from '../../../types';
import {Tag} from 'primereact/tag';
import EditOperator from './EditOperator';
import UsuarioService from "@/demo/services/usuario/UsuarioService";

const OperatorLogged = () => {
    const [user, setUser] = useState<Demo.User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const searchParams = useSearchParams();

    // Função para buscar o operators logado com ID
    useEffect(() => {
        if (!mounted) return;

        const fetchOperatorLogged = async () => {
            setLoading(true);
            try {
                const userId = searchParams.get('id');

                if (userId) {
                    const data = await UsuarioService.getUsuarioById(Number(userId));
                    setUser(data);
                } else {
                    console.error('ID do operators não encontrado na URL');
                }
            } catch (error) {
                console.error('Erro ao buscar o operators logado:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOperatorLogged();
    }, [mounted, searchParams]);

    const openEditDialog = () => {
        setEditDialogVisible(true);
    };

    const formatRoles = (roles: Demo.Role[]) => {
        return roles.map(role => role.name).join(', ');
    };

    const statusBodyTemplate = (newUser: Demo.User) => {
        const status = newUser.active ? 'Ativo' : 'Inativo';
        return <Tag value={status} severity={getSeverity(status)}></Tag>;
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'Ativo':
                return 'success';
            case 'Inativo':
                return 'danger';
            default:
                return null;
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Gerenciar operador</h5>
                <span className="p-input-icon-left">
            </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="grid">
            <div className="col-12 mt-5">
                {user && (
                    <DataTable
                        value={[user]}
                        loading={loading}
                        emptyMessage="Nenhum registro encontrado..."
                        dataKey="id"
                        header={header}
                        tableStyle={{minWidth: '50rem'}}
                    >
                        <Column field="id" header="Código"></Column>
                        <Column field="name" header="Nome"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="roles" header="Função"
                                body={(rowData: Demo.User) => formatRoles(rowData.roles)}/>
                        <Column field="ativo" header="Status" body={statusBodyTemplate}></Column>
                        <Column header="Editar Cadastro" body={() => (
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success"
                                    onClick={openEditDialog}/>
                        )}/>
                    </DataTable>
                )}
            </div>

            {/* Componente de edição */}
            <EditOperator
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                operator={user} // Passa os dados do operators
            />
        </div>
    );
};

export default OperatorLogged;
