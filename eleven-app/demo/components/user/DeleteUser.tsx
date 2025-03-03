import {Demo} from '../../../types';
import React, {useEffect, useState} from 'react';
import {Toast} from 'primereact/toast';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import UsuarioService from "@/demo/services/usuario/UsuarioService";

type DeletarUsuarioProps = {
    usuario: Demo.Usuario | null;
    isOpen: boolean;
    onHide: () => void;
    onUpdate?: () => void;
    toast: React.RefObject<Toast>;
};


const DeleteUser: React.FC<DeletarUsuarioProps> = ({usuario, isOpen, onHide, onUpdate, toast}) => {
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Demo.Usuario | null>(null);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen && usuario) {
            setUsuarioSelecionado(usuario);
            setDeleteUsuarioDialog(true);
        }
    }, [isOpen, usuario]);

    const deleteUsuario = async (usuario: Demo.Usuario) => {
        if (usuario.id != null) { // Verifica se o id não é null
            try {
                const success = await UsuarioService.deleteUsuario(usuario.id);
                if (success) {
                    onUpdate?.();
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Usuário excluído com sucesso',
                        life: 3000,
                    });
                    onHide();
                    setDeleteUsuarioDialog(false);
                } else {
                    throw new Error('Erro ao excluir usuário');
                }
            } catch (error) {
                console.error('Falha ao excluir o usuário:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao excluir usuário',
                    life: 3000,
                });
            }
        } else {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'ID do usuário não encontrado',
                life: 3000,
            });
        }
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
        onHide();
    };

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Sim" severity="info" icon="pi pi-check" text
                    onClick={() => usuarioSelecionado && deleteUsuario(usuarioSelecionado)}/>
            <Button label="Não" severity="danger" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog}/>
        </>
    );

    return (
        <Dialog
            visible={deleteUsuarioDialog}
            style={{width: '450px'}}
            header="Confirmar Exclusão"
            modal
            footer={deleteUsuarioDialogFooter}
            onHide={hideDeleteUsuarioDialog}
        >
            <div className="flex align-items-center justify-content-center">
                <i className="pi pi-exclamation-triangle mr-3" style={{fontSize: '2rem'}}/>
                {usuarioSelecionado &&
                    <span>Tem certeza de que deseja excluir o usuário: <strong>{usuarioSelecionado.nome}</strong>?</span>}
            </div>
        </Dialog>
    );
};

export default DeleteUser;