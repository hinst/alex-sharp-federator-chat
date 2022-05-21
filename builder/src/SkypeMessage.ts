const SKYPE_TEXT_MESSAGE_TYPES = ['Text', 'RichText'];

export default class SkypeMessage {
    from?: string;
    content?: string;
    messagetype?: string;
}
