"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primeflex/primeflex.css";
import { UserProfileService } from "@/demo/services/usuario/UserProfileService";

interface Address {
  id: number;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
}

interface UserWithProfile {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  userProfileId: number | null;
  cpf: string | null;
  birthDate: string | null;
  phone: string | null;
  motherName: string | null;
  fatherName: string | null;
  addresses: Address[] | null | undefined;
}

const PersonDataTable = () => {
  const [usersWithProfiles, setUsersWithProfiles] = useState<UserWithProfile[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(
    null
  );
  const [visibleDialog, setVisibleDialog] = useState(false);
  const toast = useRef<Toast>(null);
  const [showform, setShowform] = useState(false);

  useEffect(() => {
    const fetchUsersWithProfiles = async () => {
      try {
        setLoading(true);
        const users: UserWithProfile[] =
          await UserProfileService.getUsersWithProfiles();
        setUsersWithProfiles(users);
      } catch (error) {
        console.error("Erro ao buscar usuários com perfis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithProfiles();
  }, []);

  // const handleRowClick = (rowData: UserWithProfile) => {
  //   setSelectedUser(rowData);
  //   setVisibleDialog(true);
  // };

  const handleRowClick = (rowData: UserWithProfile) => {
    // Se não houver endereços, adiciona um endereço vazio
    const userWithAddresses = {
      ...rowData,
      addresses: rowData.addresses?.length ? rowData.addresses : [emptyAddress],
    };

    setSelectedUser(userWithAddresses);
    setVisibleDialog(true);
  };

  const handleSave = async () => {
    if (selectedUser) {
      try {
        // Aqui você pode chamar o serviço para salvar ou atualizar o perfil
        // await UserProfileService.saveOrUpdateProfile(selectedUser);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Perfil salvo com sucesso",
          life: 3000,
        });
        setVisibleDialog(false);
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao salvar perfil",
          life: 3000,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <ProgressSpinner />
      </div>
    );
  }

  // Endereço vazio
  const emptyAddress = {
    id: 0, // ID temporário
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: "",
  };

  return (
    <div className="card">
      <h1>Usuários com Perfis</h1>
      <DataTable
        value={usersWithProfiles}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowClick={(e) => handleRowClick(e.data as UserWithProfile)}
        selectionMode="single"
      >
        <Column field="id" header="ID" sortable />
        <Column field="name" header="Nome" sortable />
        <Column field="email" header="Email" sortable />
        <Column
          field="cpf"
          header="CPF"
          body={(rowData: UserWithProfile) => rowData.cpf || "Não informado"}
        />
        <Column
          field="phone"
          header="Telefone"
          body={(rowData: UserWithProfile) => rowData.phone || "Não informado"}
        />
      </DataTable>

      <Dialog
        header="Editar Perfil"
        visible={visibleDialog}
        style={{ width: "50vw" }}
        onHide={() => setVisibleDialog(false)}
      >
        {selectedUser && (
          <div className="p-fluid">
            <div className="formgrid grid">
              {/* Coluna 1: Dados Pessoais */}
              <div className="field col-12 md:col-6">
                <div className="field">
                  <label htmlFor="name">Nome</label>
                  <InputText
                    id="name"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <InputText
                    id="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="cpf">CPF</label>
                  <InputMask
                    id="cpf"
                    value={selectedUser.cpf || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        cpf: e.value ?? "",
                      })
                    }
                    mask="999.999.999-99"
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">Telefone</label>
                  <InputMask
                    id="phone"
                    value={selectedUser.phone || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.value ?? "",
                      })
                    }
                    mask="(99) 99999-9999"
                  />
                </div>
                <div className="field">
                  <label htmlFor="birthDate">Data de Nascimento</label>
                  <InputText
                    id="birthDate"
                    value={selectedUser.birthDate || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="motherName">Nome da Mãe</label>
                  <InputText
                    id="motherName"
                    value={selectedUser.motherName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        motherName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="fatherName">Nome do Pai</label>
                  <InputText
                    id="fatherName"
                    value={selectedUser.fatherName || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Coluna 2: Endereço */}
              <div className="field col-12 md:col-6">
                <div className="field">
                  {selectedUser.addresses?.map((addr) => (
                    <div key={addr.id} className="p-fluid">
                      <div className="field">
                        <label htmlFor="zipCode">CEP</label>
                        <InputMask
                          id="zipCode"
                          value={addr.zipCode}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, zipCode: e.value ?? "" }
                                  : a
                              ),
                            })
                          }
                          mask="99999-999"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="street">Rua</label>
                        <InputText
                          value={addr.street}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, street: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="number">Número</label>
                        <InputText
                          value={addr.number}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, number: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="complement">Complemento</label>
                        <InputText
                          value={addr.complement}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, complement: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="district">Bairro</label>
                        <InputText
                          value={addr.district}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, district: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <InputText
                          value={addr.city}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, city: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="uf">UF</label>
                        <InputText
                          value={addr.uf}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              addresses: selectedUser.addresses?.map((a) =>
                                a.id === addr.id
                                  ? { ...a, uf: e.target.value }
                                  : a
                              ),
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="field">
              <Button label="Salvar" icon="pi pi-check" onClick={handleSave} />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default PersonDataTable;
