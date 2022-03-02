class Command {
  constructor(message, trigger) {
    //Todas informações úteis da estrutura da mensagem aqui -->
    this.message = message;
    this.text = message.text;
    this.sender_id = message.sender.id;
    this.sender_name = message.sender.notifyName;
    this.chat = message.chat.id;
    this.is_group_msg = message.isGroupMsg;
    this.is_media = message.isMedia;

    //Verificar
    this.is_media == true
      ? (this.media = message.mediaData)
      : (this.media = null);
    
      this.text.
      this.is_command 
  }
}

module.exports = { Command };
