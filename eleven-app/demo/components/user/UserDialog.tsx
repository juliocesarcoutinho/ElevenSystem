import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {InputNumber} from "primereact/inputnumber";

const UserDialog = ({user, visible, onHide}: {
    user: Demo.User | null,
    visible: boolean,
    onHide: () => void
}) => {
    return (
        <Dialog header="Detalhes do Usuário" visible={visible} style={{width: '50vw'}} onHide={onHide}>
            {user && (
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="id">ID</label>
                        <InputNumber id="id" value={user.id} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="nome">Nome</label>
                        <InputText id="nome" value={user.name} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={user.email} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="roles">Funções</label>
                        <InputText id="roles" value={user.roles.map(role => role.authority).join(', ')} disabled/>
                    </div>
                    <div className="field">
                        <label htmlFor="status">Status</label>
                        <InputText id="status" value={user.active ? 'Ativo' : 'Inativo'} disabled/>
                    </div>
                </div>
            )}
        </Dialog>
    );
};

export default UserDialog;