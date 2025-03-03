"use client";
import {Demo} from '../../../types';
import React, {useRef} from 'react';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {RoleService} from "@/demo/services/role/RoleService";

type DeletarRoleProps = {
    role: Demo.Role;
    isOpen: boolean;
    onHide: () => void;
    onDeleteSuccess: () => void;
};

const DeleteRole: React.FC<DeletarRoleProps> = ({role, isOpen, onHide, onDeleteSuccess}) => {
    const toast = useRef<Toast>(null);

    const deletarRole = async () => {
        if (role.id === null) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'ID da função não encontrado',
                life: 3000,
            });
            return;
        }

        try {
            const response = await RoleService.deleteRole(role.id);

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Função excluída com sucesso',
                    life: 3000,
                });
                onDeleteSuccess();
                onHide();
            } else {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Aviso',
                    detail: response.message || 'Erro ao excluir função',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Erro ao excluir função:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao excluir função',
                life: 3000,
            });
        }
    };


    const deleteRoleDialogFooter = (
        <>
            <Button label="Sim" severity="info" icon="pi pi-check" text onClick={deletarRole}/>
            <Button label="Não" severity="danger" icon="pi pi-times" text onClick={onHide}/>
        </>
    );

    return (
        <>
            <Toast ref={toast}/>
            <Dialog
                visible={isOpen}
                style={{width: '450px'}}
                header="Confirmar Exclusão"
                modal
                footer={deleteRoleDialogFooter}
                onHide={onHide}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                    <p>Tem certeza que deseja excluir a função: <strong>{role.descricao}</strong>?</p>
                </div>
            </Dialog>
        </>
    );
};

export default DeleteRole;
