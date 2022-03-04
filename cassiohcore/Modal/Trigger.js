class Trigger {
  constructor(message, trigger) {
    //O trigger organiza as estruturas da mensagem, compara com o trigger passado e ativa um comando

    this.message = message;
    this.text = message.text.toString().toLowerCase();
    this.sender_id = message.sender.id;
    this.sender_name = message.sender.notifyName;
    this.chat = message.chat.id;
    this.is_group_msg = message.isGroupMsg;
    this.is_media = message.isMedia;

    this.params = [];
    this.text_array = this.text.toString().toLowerCase().split(/[ ,]+/);
    this.text_command = this.text_array?.[0]
      ? this.text_array[0].toString().toLowerCase()
      : null;

    this.text_array.forEach((element, key) => {
      //Separa o texto da mensagem em parâmetros removendo o comando inicial
      key == 0 ? false : this.params.push(element);
    });

    this.is_media == true
      ? (this.media = message.mediaData)
      : (this.media = null);

    this.is_command = this.text_command.startsWith("/");

    //Trigger
    this.trigger = trigger.toString().toLowerCase();
  }

  checkTrigger() {
    //Eu não entendo o que diabos acontece aqui, por algum motivo this.trigger desaparece com o '/' do comando, e ja tirei todos os tratamentos nessa variável mas ela continua a tirar
    if (this.text_command.replace("/", "") === this.trigger) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = { Trigger };
