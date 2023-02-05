export interface IMessage_format {
    //Message
    id?: string;
    body?: string;
    text?: string;
    /* type?: chat_type; */
    from?: string;
    to?: string;
    isForwarded?: boolean;
    chat_id?: string;
    isFrom_group?: boolean;
    _serialized_chat_id?: string;
    isMedia?: boolean;
    last_chat_message_id?: string;
    not_Spam?: boolean;
    timestamp?: number | string;
    //Sender
    sender_id?: string;
    sender_name?: string;
    sender_number?: string;
    sender_pfp?: string;
    //Extra params
    command_key?: string;
    command_key_raw?: string;
    command_params?: Array<string>;
    command_options?: Array<string>;
    specific?: any;
    //Venom Client
    client_name?: any;
    message?: any;
  }