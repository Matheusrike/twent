"use client";

export function AppointmentsHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Agendamentos</h2>
        <p className="text-muted-foreground">
          Gerencie os agendamentos dos clientes
        </p>
      </div>
    </div>
  );
}

