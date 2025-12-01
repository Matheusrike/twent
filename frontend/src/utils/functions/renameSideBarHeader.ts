export function renameTitleFn(title: string) {
  const renameList = [
    { oldName: "Financial", newName: "Financeiro" },
    { oldName: "Inventory", newName: "Estoque" },
    { oldName: "Branches", newName: "Filiais" },
    { oldName: "Team", newName: "Colaboradores" },
    { oldName: "Profile", newName: "Minha conta" },
    { oldName: "Pdv", newName: "Venda Rápida" },
    { oldName: "Collection", newName: "Coleção" },
  ];

  return renameList.find((item) => item.oldName === title)?.newName || title;
}
