"use client";
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CheckboxChangeEvent } from "primereact/checkbox";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Demo } from "../../../../types";
import { ProgressSpinner } from "primereact/progressspinner";
import UsuarioService from "@/demo/services/usuario/UsuarioService";
import UserDataTable from "@/demo/components/user/UserDataTable";
import { RoleService } from "@/demo/services/role/RoleService";

const CadastroUsuario = () => {
  interface DropdownItem {
    name: string;
    code: string;
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState<string>("");
  const [password, setPassword] = useState("");
  const [dropdownItem, setDropdownItem] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [inativo, setInativo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showExitButton, setShowExitButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<Demo.Usuario[]>([]);
  const toast = useRef<Toast>(null);
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);

  const [validationError, setValidationError] = useState({
    name: false,
    email: false,
    celular: false,
    password: false,
    dropdownItem: false,
  });

  const validarCamposObrigatorios = () => {
    const erros = {
      name: !name.trim(),
      email: !email?.trim(),
      celular: !celular.trim(),
      password: !password.trim(),
      dropdownItem: !dropdownItem?.trim(),
    };

    setValidationError(erros);
    return Object.values(erros).some((campoVazio) => campoVazio);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCelular("");
    setPassword("");
    setDropdownItem(null);
    setActive(true);
    setInativo(false);
  };

  const fetchRolesFromAPI = async () => {
    try {
      const fetchedRoles = await RoleService.getRoles("/roles");
      const dropdownOptions = fetchedRoles.map((role) => ({
        name: role.authority,
        code: String(role.id),
      }));
      setDropdownItems(dropdownOptions);
    } catch (error) {
      console.error("Erro ao buscar roles da API:", error);
    }
  };

  useEffect(() => {
    fetchRolesFromAPI().then((r) => r);
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      const fetchedUsuarios = await UsuarioService.getUsuarios();
      setUsuarios(fetchedUsuarios);
      setLoading(false);
    };

    fetchUsuarios().then((r) => r);
  }, []);

  const handleExitClick = () => {
    setShowForm(false);
    setShowExitButton(false);
  };

  const handleAtivoChange = (e: CheckboxChangeEvent) => {
    setActive(e.checked ?? false);
    if (e.checked) {
      setInativo(false);
    }
  };

  const handleInativoChange = (e: CheckboxChangeEvent) => {
    setInativo(e.checked ?? false);
    if (e.checked) {
      setActive(false);
    }
  };

  const SalvarUsuario = async () => {
    if (validarCamposObrigatorios()) {
      return;
    }

    setLoading(true);
    const usuario = {
      name: name,
      email,
      password,
      celular,
      active: active,
      dataCadastro: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      roles: dropdownItem
        ? [
            {
              id: Number(dropdownItem),
              name:
                dropdownItems.find((item) => item.code === dropdownItem)
                  ?.name || "",
            },
          ]
        : [],
    };

    try {
      // @ts-ignore
      const response = await UsuarioService.createUsuario(usuario);

      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário criado com sucesso",
          life: 3000,
        });

        const updatedUsuarios = await UsuarioService.getUsuarios();
        setUsuarios(updatedUsuarios);
        resetForm();
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Aviso",
          detail: response.message, // Aqui agora exibe apenas as mensagens relevantes
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro inesperado ao criar usuário",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTelefoneChange = (e: InputMaskChangeEvent) => {
    setCelular(e.value ?? "");
  };

  return (
    <div className="col-12">
      {loading && (
        <div className="loading-overlay">
          <ProgressSpinner />
        </div>
      )}
      <div className="card">
        <Toast ref={toast} />
        <div className="card flex justify-content-start gap-2">
          <Button
            type="button"
            severity="info"
            label="Cadastrar Usuário"
            icon="pi pi-user-plus"
            onClick={() => {
              setShowForm(true);
              setShowExitButton(true);
            }}
          />
          {showExitButton && (
            <Button
              type="button"
              severity="danger"
              label="Fechar Cadastro"
              icon="pi pi-times"
              onClick={handleExitClick}
              className="ml-2"
            />
          )}
        </div>

        {showForm && (
          <>
            <h1>Cadastro de Usuários</h1>
            <div className="py-2 p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="name">Nome *</label>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Digite o nome"
                  className={validationError.name ? "p-invalid" : ""}
                />
                {validationError.name && (
                  <small className="p-error">O nome é obrigatório</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="email">Email *</label>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={validationError.email ? "p-invalid" : ""}
                  placeholder="Digite o email"
                />
                {validationError.email && (
                  <small className="p-error">O e-mail é obrigatório</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="celular">Celular *</label>
                <InputMask
                  id="celular"
                  value={celular}
                  onChange={handleTelefoneChange}
                  className={validationError.celular ? "p-invalid" : ""}
                  mask="(99)99999-9999"
                  required
                  placeholder="Digite o telefone"
                />
                {validationError.celular && (
                  <small className="p-error">O telefone é obrigatório</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="senha">Senha *</label>
                <Password
                  id="senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={validationError.password ? "p-invalid" : ""}
                  required
                  placeholder="Digite a senha"
                  feedback={false}
                />
                {validationError.password && (
                  <small className="p-error">A senha é obrigatória</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label htmlFor="roles">Função *</label>
                <Dropdown
                  id="roles"
                  value={dropdownItem}
                  options={dropdownItems}
                  onChange={(e) => setDropdownItem(e.value)}
                  optionLabel="name"
                  optionValue="code"
                  placeholder="Selecione a função"
                />
                {validationError.dropdownItem && (
                  <small className="p-error">A função é obrigatória</small>
                )}
              </div>

              <div className="field col-12 md:col-6">
                <label>Status do usuário</label>
                <div className="flex">
                  <div className="field-radiobutton">
                    <input
                      className="custom-radio"
                      type="radio"
                      id="active"
                      name="scad"
                      checked={active}
                      onChange={() => {
                        setActive(true);
                        setInativo(false);
                      }}
                    />
                    <label htmlFor="active">Ativo</label>
                  </div>
                  <div className="field-radiobutton ml-3">
                    <input
                      className="custom-radio"
                      type="radio"
                      id="inativo"
                      name="scad"
                      checked={inativo}
                      onChange={() => {
                        setInativo(true);
                        setActive(false);
                      }}
                    />
                    <label htmlFor="inativo">Inativo</label>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <Button
                  type="button"
                  severity="success"
                  label="Salvar Usuário"
                  icon="pi pi-check"
                  onClick={SalvarUsuario}
                  loading={loading}
                />
              </div>
            </div>
          </>
        )}
        <UserDataTable usuarios={usuarios} loading={false} />
      </div>
    </div>
  );
};

export default CadastroUsuario;
