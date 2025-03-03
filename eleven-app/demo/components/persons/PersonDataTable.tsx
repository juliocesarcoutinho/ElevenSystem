"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { UserProfileService } from "@/demo/services/usuario/UserProfile";
import { Toast } from "primereact/toast";
import "primeflex/primeflex.css"; // Importação do PrimeFlex

interface UserProfile {
  id: number;
  cpf: string;
  birthDate: string;
  phone: string;
  motherName: string;
  fatherName: string;
  user: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    roles: { id: number; authority: string }[];
  };
  address: {
    id: number;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    district: string;
    city: string;
    uf: string;
  }[];
}

const PersonDataTable = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const [visibleDialog, setVisibleDialog] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      try {
        setLoading(true);
        const { content } = await UserProfileService.getUserProfiles();
        setUserProfiles(content);
      } catch (error) {
        console.error("Erro ao buscar perfis de usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfiles();
  }, []);

  const handleRowClick = (rowData: UserProfile) => {
    setSelectedProfile(rowData);
    setVisibleDialog(true);
  };

  const handleSave = async () => {
    if (selectedProfile) {
      try {
        // Aqui você pode chamar o serviço para atualizar o perfil na API
        // await UserProfileService.updateUserProfile(selectedProfile);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Perfil atualizado com sucesso",
          life: 3000,
        });
        setVisibleDialog(false);
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao atualizar perfil",
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

  return (
    <div className="card">
      <h1>Perfis de Usuários</h1>
      <DataTable
        value={userProfiles}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowClick={(e) => handleRowClick(e.data)}
        selectionMode="single"
      >
        <Column field="id" header="ID" sortable />
        <Column field="user.name" header="Nome" sortable />
        <Column field="cpf" header="CPF" sortable />
        <Column field="phone" header="Telefone" sortable />
        <Column field="user.email" header="Email" sortable />
      </DataTable>

      <Dialog
        header="Editar Perfil"
        visible={visibleDialog}
        style={{ width: "50vw" }}
        onHide={() => setVisibleDialog(false)}
      >
        {selectedProfile && (
          <div className="p-fluid">
            <div className="formgrid grid">
              {/* Coluna 1: Dados Pessoais */}
              <div className="field col-12 md:col-6">
                <div className="field">
                  <label htmlFor="name">Nome</label>
                  <InputText
                    id="name"
                    value={selectedProfile.user.name}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
                        user: { ...selectedProfile.user, name: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <InputText
                    id="email"
                    value={selectedProfile.user.email}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
                        user: {
                          ...selectedProfile.user,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="cpf">CPF</label>
                  <InputMask
                    id="cpf"
                    value={selectedProfile.cpf}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
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
                    value={selectedProfile.phone}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
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
                    value={selectedProfile.birthDate}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
                        birthDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="motherName">Nome da Mãe</label>
                  <InputText
                    id="motherName"
                    value={selectedProfile.motherName}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
                        motherName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="fatherName">Nome do Pai</label>
                  <InputText
                    id="fatherName"
                    value={selectedProfile.fatherName}
                    onChange={(e) =>
                      setSelectedProfile({
                        ...selectedProfile,
                        fatherName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Coluna 2: Endereço */}
              <div className="field col-12 md:col-6">
                <div className="field">
                  {selectedProfile.address.map((addr) => (
                    <div key={addr.id} className="p-fluid">
                      {/* Campo CEP */}
                      <div className="field">
                        <label htmlFor="cep">CEP</label>
                        <InputMask
                          id="cep"
                          value={addr.zipCode}
                          onChange={(e) =>
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
                            setSelectedProfile({
                              ...selectedProfile,
                              address: selectedProfile.address.map((a) =>
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
