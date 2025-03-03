"use client";
import React, {useEffect, useRef, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {Demo} from '../../../types';
import EditRole from './EditRole';
import DeleteRole from './DeleteRole';
import {RoleService} from "@/demo/services/role/RoleService";

const RolesDataTable = ({roles: initialRoles, loading}: { roles: Demo.Role[], loading: boolean }) => {
    const toast = useRef<Toast>(null);
    const [roles, setRoles] = useState<Demo.Role[]>([]);
    const [roleEditar, setRoleEditar] = useState<Demo.Role | null>(null);
    const [editarRoleDialog, setEditarRoleDialog] = useState(false);
    const [roleDeletar, setRoleDeletar] = useState<Demo.Role | null>(null);
    const [deletarRoleDialog, setDeletarRoleDialog] = useState(false);


    const fetchRoles = async () => {
        try {
            const fetchedRoles = await RoleService.getRoles('/roles');
            setRoles(fetchedRoles);
        } catch (error) {
            console.error('Erro ao buscar funções:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar funções',
                life: 3000
            });
        }
    };

    useEffect(() => {
        if (initialRoles && initialRoles.length > 0) {
            setRoles(initialRoles);
        } else {
            fetchRoles();
        }
    }, [initialRoles]);

    const editarRole = async (role: Demo.Role) => {
        if (role.id) {
            try {
                const response = await RoleService.getRoleById(role.id);

                if (response.success && response.role) {
                    const roleEncontrada: Demo.Role = response.role;
                    setRoleEditar(roleEncontrada);
                    setEditarRoleDialog(true);
                } else {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: response.message || 'Função não encontrada',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar função para edição:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os dados da função para edição',
                    life: 3000
                });
            }
        }
    };

    const deletarRole = async (role: Demo.Role) => {
        if (role.id) {
            try {
                const response = await RoleService.getRoleById(role.id);

                if (response.success && response.role) {
                    const roleEncontrada: Demo.Role = response.role;
                    setRoleDeletar(roleEncontrada);
                    setDeletarRoleDialog(true);
                } else {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: response.message || 'Função não encontrada',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Erro ao buscar função para edição:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os dados da função para edição',
                    life: 3000
                });
            }
        }
    };

    const actionBodyTemplate = (rowData: Demo.Role) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    onClick={() => editarRole(rowData)}
                />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
                        onClick={() => deletarRole(rowData)}/>
            </div>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Listagem de Funções</h5>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="col-12 mt-5">
            <Toast ref={toast}/>
            <DataTable
                value={roles}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                emptyMessage="Nenhum registro encontrado..."
                dataKey="id"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} funções"
                tableStyle={{minWidth: '50rem'}}
                header={header}
                loading={loading}
            >
                <Column field="id" header="Código"></Column>
                <Column field="descricao" header="Nome da Função"></Column>
                <Column field="tipoUsuario" header="Tipo"></Column>
                <Column body={actionBodyTemplate} header="Ações"/>
            </DataTable>

            {/* Componente para Editar Função */}
            {roleEditar && (
                <EditRole
                    role={roleEditar}
                    isOpen={editarRoleDialog}
                    onHide={() => setEditarRoleDialog(false)}
                    setRoles={setRoles}
                    onUpdate={fetchRoles}
                />
            )}

            {/* Componente para Deletar Função */}
            {roleDeletar && (
                <DeleteRole
                    role={roleDeletar}
                    isOpen={deletarRoleDialog}
                    onHide={() => setDeletarRoleDialog(false)}
                    onDeleteSuccess={fetchRoles}
                />
            )}
        </div>
    );
};

export default RolesDataTable;
