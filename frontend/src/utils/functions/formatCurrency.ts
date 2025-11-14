export function formatCurrency(value: number | string) {
    const numberValue = Number(value);
    
    if (isNaN(numberValue)) return "—"; 
    
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }