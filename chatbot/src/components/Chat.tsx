import { h, Component } from 'preact';
import { MESSAGES, TOP_WORDS } from '../data/topWords';

export default class Chat extends Component {
    state = { message: '' };

    render() {
        return <div>
            <input
                type="text"
                autofocus
                value={this.state.message}
                onInput={this.onInput.bind(this)}
                onKeyDown={this.onKeyDown.bind(this)}
            />
        </div>;
    }

    private onInput(event: any) {
        const value: string = event.target.value;
        this.setState({ message: value });
    }

    private onKeyDown(event: any) {
        const key = event.key;
        if (key == 'Enter') {
            this.generate();
            this.setState({ message: '' });
        }
    }

    private generate() {
        const words = getWords(this.state.message);
        const desiredWord = words.length ? words[0] : '';

        let messages = MESSAGES.filter(message => message.some(word => word == desiredWord));
        if (messages.length == 0)
            messages = MESSAGES.filter(message => message.some(word => word.includes(desiredWord)));
        if (messages.length == 0)
            messages = MESSAGES.filter(message => TOP_WORDS.some(word => message.includes(word)));

        let message1 = messages[Math.floor(Math.random() * messages.length)];
        const chainingWords = message1.filter(word => TOP_WORDS.includes(word));
        const chainingWord = chainingWords[Math.floor(Math.random() * chainingWords.length)];
        const chainingWordIndex = message1.indexOf(chainingWord);

        const messages2 = MESSAGES.filter(message => message.includes(chainingWord) && message != message1 &&
            !(chainingWordIndex == 0 && message.indexOf(chainingWord) == 0)
        );
        const message2 = messages2[Math.floor(Math.random() * messages2.length)];
        console.log(message1, message2);
    }
}

function getWords(text: string) {
    const words: string[] = [];
    let word = '';
    for (const character of text) {
        if (isLetter(character))
            word += character;
        else if (word.length) {
            words.push(word.toLowerCase());
            word = '';
        }
    }
    if (word.length)
        words.push(word.toLowerCase());
    if (words.length && words[words.length - 1] == '.')
        words.pop();
    return words;
}

function isLetter(text: string) {
    return text.toString().toLowerCase() != text.toString().toUpperCase();
}
