import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
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
  updatedAt: string;
  userProfileId: number | null;
  cpf: string | null;
  birthDate: string | null;
  phone: string | null;
  motherName: string | null;
  fatherName: string | null;
  address: Address;
}

const PersonForm = ({
  onSave,
}: {
  onSave: () => void;
  onClose: () => void;
}) => {
  const [newUser, setNewUser] = useState<UserWithProfile>({
    id: 0,
    name: "",
    email: "",
    updatedAt: new Date().toISOString(),
    userProfileId: null,
    cpf: null,
    birthDate: null,
    phone: null,
    motherName: null,
    fatherName: null,
    address: {
      id: 0,
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      uf: "",
    },
  });

  const handleSave = async () => {
    try {
      await UserProfileService.save(newUser);
      onSave();
    } catch (error) {
      console.error("Erro ao salvar novo usuário:", error);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setNewUser({ ...newUser, address: { ...newUser.address, [field]: value } });
  };

  return (
    <div className="p-fluid">
      {/* Dados do Usuário */}
      <h3>Dados do Usuário</h3>
      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="name">Nome *</label>
          <InputText
            id="name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Digite o nome"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="cpf">CPF *</label>
          <InputMask
            id="cpf"
            value={newUser.cpf || ""}
            onChange={(e) => setNewUser({ ...newUser, cpf: e.value ?? "" })}
            mask="999.999.999-99"
            placeholder="Digite o CPF"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="email">Email *</label>
          <InputText
            id="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Digite o email"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="phone">Celular *</label>
          <InputMask
            id="phone"
            value={newUser.phone || ""}
            onChange={(e) => setNewUser({ ...newUser, phone: e.value ?? "" })}
            mask="(99) 99999-9999"
            placeholder="Digite o celular"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="birthDate">Data de Nascimento *</label>
          <InputMask
            id="birthDate"
            value={newUser.birthDate || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, birthDate: e.value ?? "" })
            }
            mask="99/99/9999"
            placeholder="Digite a data de nascimento"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="motherName">Nome da Mãe</label>
          <InputText
            id="motherName"
            value={newUser.motherName || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, motherName: e.target.value })
            }
            placeholder="Digite o nome da mãe"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="fatherName">Nome do Pai</label>
          <InputText
            id="fatherName"
            value={newUser.fatherName || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, fatherName: e.target.value })
            }
            placeholder="Digite o nome do pai"
          />
        </div>
      </div>

      {/* Endereço */}
      <h3>Endereço</h3>
      <div className="formgrid grid">
        <div className="field col-12 md:col-4">
          <label htmlFor="zipCode">CEP *</label>
          <InputMask
            id="zipCode"
            value={newUser.address.zipCode}
            onChange={(e) => handleAddressChange("zipCode", e.value ?? "")}
            mask="99999-999"
            placeholder="Digite o CEP"
          />
        </div>
        <div className="field col-12 md:col-8">
          <label htmlFor="street">Rua *</label>
          <InputText
            id="street"
            value={newUser.address.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            placeholder="Digite a rua"
          />
        </div>
        <div className="field col-12 md:col-3">
          <label htmlFor="number">Número *</label>
          <InputText
            id="number"
            value={newUser.address.number}
            onChange={(e) => handleAddressChange("number", e.target.value)}
            placeholder="Digite o número"
          />
        </div>
        <div className="field col-12 md:col-5">
          <label htmlFor="complement">Complemento</label>
          <InputText
            id="complement"
            value={newUser.address.complement}
            onChange={(e) => handleAddressChange("complement", e.target.value)}
            placeholder="Digite o complemento"
          />
        </div>
        <div className="field col-12 md:col-4">
          <label htmlFor="district">Bairro *</label>
          <InputText
            id="district"
            value={newUser.address.district}
            onChange={(e) => handleAddressChange("district", e.target.value)}
            placeholder="Digite o bairro"
          />
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="city">Cidade *</label>
          <InputText
            id="city"
            value={newUser.address.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
            placeholder="Digite a cidade"
          />
        </div>
        <div className="field col-12 md:col-2">
          <label htmlFor="uf">UF *</label>
          <InputText
            id="uf"
            value={newUser.address.uf}
            onChange={(e) => handleAddressChange("uf", e.target.value)}
            placeholder="Digite a UF"
          />
        </div>
      </div>

      <div className="field flex gap-2 mt-4">
        <Button
          label="Salvar Usuário"
          icon="pi pi-check"
          onClick={handleSave}
        />
      </div>
    </div>
  );
};

export default PersonForm;
