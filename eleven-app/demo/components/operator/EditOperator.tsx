'use client';

import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Dialog} from 'primereact/dialog';
import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {Demo} from '../../../types';
import {Toast} from 'primereact/toast';
import UsuarioService from "@/demo/services/usuario/UsuarioService";

interface EditOperatorProps {
    visible: boolean;
    onHide: () => void;
    operator: Demo.User | null;
}

const EditOperator: React.FC<EditOperatorProps> = ({visible, onHide, operator}) => {
    const [user, setUser] = useState<Demo.User | undefined>(operator || {authority: '', email: ''});
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [password, setPassword] = useState('');
    const toast = useRef<Toast>(null);
    const [loadingSave, setLoadingSave] = useState(false);

    useEffect(() => {
        if (operator) {
            setUser(operator);
        }
    }, [operator]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const val = (e.target && e.target.value) || '';
        setUser((prevUsuario: any) => {
            if (prevUsuario) {
                return {...prevUsuario, [field]: val};
            }
            return prevUsuario;
        });
    };

    const validarUsuario = (): boolean => {
        // Validação do e-mail
        if (confirmEmail) {
            if (!user?.email || user.email !== confirmEmail) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Os e-mails não coincidem',
                    life: 3000,
                });
                return false;
            }
        }

        // Validação da password
        if (password || confirmSenha) {
            if (!password || !confirmSenha) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Os campos de Senhas são obrigatórios',
                    life: 3000,
                });
                return false;
            }

            if (password !== confirmSenha) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'As senhas não coincidem',
                    life: 3000,
                });
                return false;
            }
        }

        // Validação do usuário
        if (!user) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Usuário inválido',
                life: 3000,
            });
            return false;
        }

        return true;
    };


    const salvarUsuario = async () => {
        if (!validarUsuario()) {
            return;
        }

        setLoadingSave(true);
        try {
            const updatedUsuario = {
                ...user,
                ...(confirmEmail ? {email: confirmEmail} : {}),
                ...(password ? {senha: password} : {}),
            };

            const response = await UsuarioService.editUsuario(updatedUsuario);

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Operador atualizado com sucesso',
                    life: 3000,
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: response.message || 'Erro inesperado ao atualizar cliente.',
                    life: 5000,
                });
            }

        } catch (error: any) {

            if (error.response) {
                console.log("Erro resposta:", error.response);
                const errorData = error.response.data;

                // Certificando-se de que a resposta contém a messages de erro
                if (errorData?.message) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: errorData.message,
                        life: 5000,
                    });
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro inesperado ao atualizar cliente.',
                        life: 3000,
                    });
                }
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro inesperado ao atualizar cliente.',
                    life: 3000,
                });
            }
        } finally {
            // Adicionando delay para garantir que o Toast seja exibido antes de fechar o diálogo
            setTimeout(() => {
                setLoadingSave(false);
                onHide();
            }, 3000); // Espera 3 segundos para fechar o diálogo
        }
    };


    const usuarioDialogFooter = (
        <React.Fragment>
            <Button label="Salvar" severity="info" icon="pi pi-check" className="p-button-text"
                    onClick={salvarUsuario}/>
            <Button label="Cancelar" severity="danger" icon="pi pi-times" className="p-button-text" onClick={onHide}/>
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} position="top-right"/>
            <Dialog visible={visible} style={{width: '70%'}} header="Detalhes do Operador" modal
                    footer={usuarioDialogFooter} onHide={onHide}>
                {user && (
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Novo Email</label>
                            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="confirmEmail">Confirmar Email</label>
                            <InputText id="confirmEmail" value={confirmEmail}
                                       onChange={(e) => setConfirmEmail(e.target.value)}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="senha">Nova Senha</label>
                            <Password id="senha" value={password} onChange={(e) => setPassword(e.target.value)}
                                      feedback={false}/>
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="confirmSenha">Confirmar Senha</label>
                            <Password id="confirmSenha" value={confirmSenha}
                                      onChange={(e) => setConfirmSenha(e.target.value)} feedback={false}/>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default EditOperator;
