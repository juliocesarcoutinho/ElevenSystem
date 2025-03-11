// pages/PersonPage.tsx
"use client";
import React, { useRef, useState } from "react";
import PersonDataTable from "@/demo/components/persons/PersonDataTable";
import PersonForm from "@/demo/components/persons/PersonForm";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const PersonPage = () => {
  const [refreshTable, setRefreshTable] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const toast = useRef<Toast>(null);
  const [showExitButton, setShowExitButton] = useState(false);

  const handleSave = () => {
    setRefreshTable(!refreshTable);
    setShowForm(false);
  };

  const handleExitClick = () => {
    setShowForm(false);
    setShowExitButton(false);
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card flex justify-content-start gap-2">
        <Button
          type="button"
          severity="info"
          label="Novo"
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
            label="Fechar"
            icon="pi pi-times"
            onClick={handleExitClick}
            className="ml-2"
          />
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <PersonForm onSave={handleSave} onClose={() => setShowForm(false)} />
        </div>
      )}

      <PersonDataTable key={refreshTable.toString()} />
    </div>
  );
};

export default PersonPage;
