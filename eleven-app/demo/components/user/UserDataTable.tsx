"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
import UsuarioService from "@/demo/services/usuario/UsuarioService";
import EditUser from "@/demo/components/user/EditUser";
import DeleteUser from "@/demo/components/user/DeleteUser";

const UserDataTable = ({
  usuarios: initialUsuarios,
  loading,
}: {
  usuarios: Demo.User[];
  loading: boolean;
}) => {
  const [users, setUsers] = useState<Demo.User[]>([]);
  const toast = useRef<Toast>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState<{
    global: { value: string; matchMode: FilterMatchMode };
  }>({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [usuarioEditar, setUsuarioEditar] = useState<Demo.User | null>(null);
  const [editarUsuarioDialog, setEditarUsuarioDialog] = useState(false);
  const [deletUsuario, setDeletUsuario] = useState<Demo.User | null>(null);
  const [deletarUsuarioDialog, setDeletarUsuarioDialog] = useState(false);
  const [, setUsuarioVisualizar] = useState<Demo.User | null>(null);
  const [, setVisualizarUsuarioDialog] = useState(false);

  useEffect(() => {
    setUsers(Array.isArray(initialUsuarios) ? initialUsuarios : []);
  }, [initialUsuarios]);

  const editarUsuario = async (user: Demo.User) => {
    if (user.id) {
      try {
        const usuarioEncontrado = await UsuarioService.getUsuarioById(user.id);
        if (usuarioEncontrado) {
          setUsuarioEditar({
            ...usuarioEncontrado,
            roles: usuarioEncontrado.roles
              .filter((role: any) => role.id !== null)
              .map((role: any) => ({
                id: role.id as number,
                authority: role.authority,
              })),
          });
          setEditarUsuarioDialog(true);
        }
      } catch (error) {
        console.error("Erro ao buscar users para edição:", error);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar os dados do users para edição",
          life: 3000,
        });
      }
    }
  };

  const deletarUsuario = async (user: Demo.User) => {
    if (user.id) {
      try {
        const usuarioEncontrado = await UsuarioService.getUsuarioById(user.id);
        if (usuarioEncontrado) {
          setDeletUsuario({
            ...usuarioEncontrado,
            roles: usuarioEncontrado.roles.map((role: any) => ({
              id: role.id as number,
              authority: role.authority,
            })),
          });
          setDeletarUsuarioDialog(true);
        }
      } catch (error) {
        console.error("Erro ao buscar users para deletar:", error);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Não foi possível carregar os dados do users para deletar",
          life: 3000,
        });
      }
    }
  };

  const visualizarUsuario = (user: Demo.User) => {
    setUsuarioVisualizar(user);
    setVisualizarUsuarioDialog(true);
  };

  const actionBodyTemplate = (rowData: Demo.User) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => editarUsuario(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deletarUsuario(rowData)}
        />
      </div>
    );
  };

  const formatRoles = (roles: { id: number; authority: string }[]) => {
    return roles.map((role) => `${role.authority}`).join(", ");
  };

  const statusBodyTemplate = (user: Demo.User) => {
    const status = user.active ? "Ativo" : "Inativo";
    return <Tag value={status} severity={getSeverity(status)} />;
  };

  const getSeverity = (status: string) => {
    switch (status) {
      case "Ativo":
        return "success";

      case "Inativo":
        return "danger";

      default:
        return null;
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);

    setFilters({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Listagem de usuário</h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Pesquisar usuário..."
          />
        </span>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <div className="grid">
      <div className="col-12 mt-5">
        <Toast ref={toast} />
        <ConfirmDialog />
        <DataTable
          value={users}
          loading={loading}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="Nenhum registro encontrado..."
          dataKey="id"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
          tableStyle={{ minWidth: "50rem" }}
          filters={filters}
          header={header}
          selectionMode="single"
        >
          <Column
            field="id"
            header="Código"
            sortable
            body={(rowData: Demo.User) => (
              <div
                onClick={() => visualizarUsuario(rowData)}
                onKeyUp={(e) => e.key === "Enter" && visualizarUsuario(rowData)}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                {rowData.id}
              </div>
            )}
          />
          <Column
            field="name"
            header="Nome"
            sortable
            body={(rowData: Demo.User) => (
              <div
                onClick={() => visualizarUsuario(rowData)}
                onKeyUp={(e) => e.key === "Enter" && visualizarUsuario(rowData)}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                {rowData.name}
              </div>
            )}
          />
          <Column
            field="email"
            header="Email"
            sortable
            body={(rowData: Demo.User) => (
              <div
                onClick={() => visualizarUsuario(rowData)}
                onKeyDown={(e) =>
                  e.key === "Enter" && visualizarUsuario(rowData)
                }
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                {rowData.email}
              </div>
            )}
          />
          <Column
            field="authority"
            header="Funções"
            sortable
            body={(rowData: Demo.User) => (
              <div
                onClick={() => visualizarUsuario(rowData)}
                onKeyUp={(e) => e.key === "Enter" && visualizarUsuario(rowData)}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                {formatRoles(rowData.roles)}
              </div>
            )}
          />
          <Column
            field="active"
            header="Ativo"
            sortable
            body={(rowData: Demo.User) => (
              <div
                onClick={() => visualizarUsuario(rowData)}
                onKeyUp={(e) => e.key === "Enter" && visualizarUsuario(rowData)}
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                {statusBodyTemplate(rowData)}
              </div>
            )}
          />
          <Column body={actionBodyTemplate} header="Ações" />
        </DataTable>

        {/* Componente para Visualizar Usuário */}
        {/*<UserDialog*/}
        {/*    users={usuarioVisualizar}*/}
        {/*    visible={visualizarUsuarioDialog}*/}
        {/*    onHide={() => setVisualizarUsuarioDialog(false)}*/}
        {/*/>*/}

        {/* Componente para Editar Usuário */}
        {usuarioEditar && (
          <EditUser
            usuario={usuarioEditar}
            isOpen={editarUsuarioDialog}
            onHide={() => setEditarUsuarioDialog(false)}
            setUsuarios={setUsers}
          />
        )}

        {/* Componente para Deletar Usuário */}
        {deletUsuario && (
          <DeleteUser
            usuario={deletUsuario}
            isOpen={deletarUsuarioDialog}
            onHide={() => setDeletarUsuarioDialog(false)}
            onUpdate={() =>
              setUsers(
                users.filter((usuario) => usuario.id !== deletUsuario.id)
              )
            }
            toast={toast}
          />
        )}
      </div>
    </div>
  );
};

export default UserDataTable;
