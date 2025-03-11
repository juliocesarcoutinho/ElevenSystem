/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { BlockUI } from "primereact/blockui";
import { ProgressSpinner } from "primereact/progressspinner";
import { RecoveryPasswordService } from "@/demo/services/usuario/RecoveryPasswordService";
import { LoginService } from "@/demo/services/usuario/LoginService";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const recoveryPassword = async () => {
    setIsLoading(true);
    const response = await RecoveryPasswordService.recoveryPassword(email);
    setIsLoading(false);
    if (response.success) {
      addInfoMessage();
      setShowDialog(false);
    } else {
      addErrorMessage();
    }
  };

  const addInfoMessage = () => {
    toast.current?.show({
      severity: "success",
      summary: "Redefinição de Senha",
      detail: "Foi enviado uma nova senha no seu email, por favor verifique.",
      life: 3500,
    });
    setShowDialog(false);
  };

  const addErrorMessage = () => {
    toast.current?.show({
      severity: "error",
      summary: "Erro",
      detail:
        "Ocorreu um erro ao tentar enviar o email com a recuperação da senha.",
      life: 3000,
    });
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="Enviar"
        severity="info"
        text
        raised
        onClick={recoveryPassword}
      />
      <Button
        label="Cancelar"
        severity="danger"
        text
        raised
        onClick={() => setShowDialog(false)}
      />
    </div>
  );

  const login = async () => {
    try {
      const client_id = "myclientid";
      const client_secret = "myclientsecret";

      // Usa o LoginService para fazer a requisição
      const response = await LoginService.login(
        email,
        password,
        client_id,
        client_secret
      );

      if (response.success) {
        localStorage.setItem("authToken", response.data.access_token);
        router.push("/pages/dashboard");
      } else {
        // Exibe a mensagem de erro no toast
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Credenciais Inválidas",
          life: 3000,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Exibe uma mensagem de erro genérica no toast
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro inesperado no login",
        life: 3000,
      });
    }
  };

  return (
    <BlockUI blocked={isLoading} fullScreen>
      <div className={containerClassName}>
        <div className="flex flex-column align-items-center justify-content-center">
          <div>
            <div
              className="w-full surface-card py-8 px-5 sm:px-8"
              style={{ borderRadius: "10px" }}
            >
              <div className="text-center mb-5">
                <h1 className="text-900 font-bold text-5xl mb-2">
                  Eleven Juventude
                </h1>
                <div className="text-900 text-3xl font-medium mb-3">
                  Bem-vindo!
                </div>
                <span className="text-600 font-medium">
                  Faça login para continuar
                </span>
              </div>

              <div>
                <label
                  htmlFor="email1"
                  className="block text-900 text-xl font-medium mb-2"
                >
                  Email
                </label>
                <InputText
                  id="email1"
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Endereço de email"
                  className="w-full md:w-30rem mb-5"
                  style={{ padding: "1rem" }}
                />

                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Senha
                </label>
                <Password
                  inputId="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                  toggleMask
                  feedback={false}
                />

                <div className="text-center mb-5">
                  <a
                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                    style={{ color: "var(--primary-color)" }}
                    onClick={() => setShowDialog(true)}
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Button
                  label="Entrar"
                  className="w-full p-3 text-xl"
                  onClick={login}
                ></Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          header="Recuperar Senha"
          visible={showDialog}
          style={{ width: "450px" }}
          footer={dialogFooter}
          onHide={() => setShowDialog(false)}
        >
          <div className="p-fluid">
            <div className="field">
              <label
                htmlFor="email"
                className="block text-900 text-xl font-medium mb-2"
              >
                Email
              </label>
              <InputText
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Digite seu email"
                className="w-full"
                style={{ padding: "1rem" }}
              />
            </div>
          </div>
        </Dialog>
        <Toast ref={toast} position="top-right" />
      </div>
      {isLoading && (
        <div
          className="flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10000,
          }}
        >
          <ProgressSpinner />
        </div>
      )}
    </BlockUI>
  );
};

export default LoginPage;
