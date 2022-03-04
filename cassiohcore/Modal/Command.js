class Command {
  constructor(levelAccess) {
    this.levelAccess = levelAccess;
    //Level 0 = root
    //Level 1 = trusted
    //Level 2 = users
  }

  executeCommand(userLevelAccess) {
    console.log("Base class executada");
    if (userLevelAccess > this.levelAccess) {
      //Talvez enviar mensagem dizendo que não possui nível de acesso
      console.log('sem acesso');
      return false;
    }
    //O que for executado aqui e comum a todos
  }
}

module.exports = { Command };
