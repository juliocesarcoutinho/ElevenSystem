"use client";
import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from 'primereact/dialog';
import {Demo} from '../../../types';
import {Button} from 'primereact/button';
import {Toast} from 'primereact/toast';
import {InputText} from 'primereact/inputtext';
import {Dropdown} from 'primereact/dropdown';
import {RoleService} from "@/demo/services/role/RoleService";

type EditarRoleProps = {
    setRoles: React.Dispatch<React.SetStateAction<Demo.Role[]>>;
    role: Demo.Role | null;
    isOpen: boolean;
    onHide: () => void;
    onUpdate?: () => void;
};

const EditRole: React.FC<EditarRoleProps> = ({role, isOpen, onHide, setRoles, onUpdate}) => {
    const toast = useRef<Toast>(null);
    const [dropdownItems, setDropdownItems] = useState<{ tipoRole: string; code: string }[]>([]);
    const [dropdownItem, setDropdownItem] = useState<string | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);
    const [roleSelecionada, setRoleSelecionada] = useState<Demo.Role>({
        id: null,
        descricao: '',
        tipoUsuario: '',
    });

    const fetchRolesFromAPI = async () => {
        try {
            const fetchedRoles = await RoleService.getRoles('/roles');
            const dropdownOptions = fetchedRoles.map((role) => ({
                tipoRole: role.tipoUsuario,
                code: String(role.id),
            }));
            setDropdownItems(dropdownOptions);
        } catch (error) {
            console.error('Erro ao buscar roles da API:', error);
        }
    };

    useEffect(() => {
        if (isOpen && role) {
            setRoleSelecionada({
                id: role.id,
                descricao: role.descricao,
                tipoUsuario: role.tipoUsuario,
            });
            setDropdownItem(role.tipoUsuario);
        } else {
            setRoleSelecionada({id: null, descricao: '', tipoUsuario: ''});
            setDropdownItem('');
        }
    }, [isOpen, role]);

    useEffect(() => {
        fetchRolesFromAPI();
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const val = e.target.value;
        setRoleSelecionada((prevRole: any) => ({...prevRole, [field]: val}));
    };

    const onDropdownChange = (e: any) => {
        const selectedValue = e.value;
        setDropdownItem(selectedValue);
        setRoleSelecionada((prevRole: any) => ({
            ...prevRole,
            tipoUsuario: selectedValue,
        }));
    };

    const editarRole = async () => {
        setLoadingSave(true);
        try {
            if (roleSelecionada) {
                const usuarioAtualizado = {...roleSelecionada, roles: [{id: dropdownItem}]};

                const response = await RoleService.editRole(usuarioAtualizado);

                if (response.success) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Função atualizada com sucesso',
                        life: 3000,
                    });
                    const updatedRoles = await RoleService.getRoles('/roles');
                    setRoles(updatedRoles);
                    onUpdate?.();
                    onHide();
                } else {
                    toast.current?.show({
                        severity: 'warn',
                        summary: 'Aviso',
                        detail: response.message,
                        life: 3000,
                    });
                }
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao atualizar usuário',
                life: 3000,
            });
        } finally {
            setLoadingSave(false);
        }
    };

    const usuarioDialogFooter = (
        <>
            <Button
                label="Salvar"
                severity="info"
                icon="pi pi-check"
                onClick={editarRole}
                className="p-button-text"
                loading={loadingSave}
            />
            <Button label="Cancelar" severity="danger" icon="pi pi-times" onClick={onHide} className="p-button-text"/>
        </>
    );

    return (
        <>
            <Toast ref={toast} position="top-right"/>
            <Dialog
                visible={isOpen}
                style={{width: '65%'}}
                header="Editar Função"
                modal
                className="p-fluid"
                footer={usuarioDialogFooter}
                onHide={onHide}
            >
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="idRole">Código da função</label>
                        <InputText id="idRole" value={roleSelecionada?.id ? String(roleSelecionada.id) : ''} disabled/>
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="nome">Nome da função</label>
                        <InputText
                            id="nome"
                            value={roleSelecionada.descricao}
                            onChange={(e) => onInputChange(e, 'descricao')}
                            placeholder="Informe o nome"
                        />
                    </div>

                    <div className={`field col-12 md:col-6 ${!dropdownItem ? 'p-invalid' : ''}`}>
                        <label htmlFor="roles">Tipo</label>
                        <Dropdown
                            id="roles"
                            value={dropdownItem}
                            options={dropdownItems}
                            onChange={onDropdownChange}
                            optionLabel="tipoRole"
                            optionValue="tipoRole"
                            placeholder="Selecione um tipo"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default EditRole;
