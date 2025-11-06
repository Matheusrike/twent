export function renameTitleFn(title : string) {
    const renameList = [
      { oldName: "Profile", newName: "Minha conta" },
    ];
  
    return renameList.find(item => item.oldName === title)?.newName || title;
  }
  