import { h, Component } from 'preact';
import { MESSAGES, TOP_WORDS } from '../data/topWords';
import lodash from 'lodash';

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

        let messages2 = MESSAGES.filter(message => message.includes(chainingWord) && message != message1 &&
            !(chainingWordIndex == 0 && message.indexOf(chainingWord) == 0)
        );
        if (messages2.length == 0)
            messages2 = MESSAGES.filter(message => message != message1);
        const message2 = messages2[Math.floor(Math.random() * messages2.length)];

        console.log(message1, chainingWord, message2);
        if (message1.includes(chainingWord)) {
            const [sentence1, direction1] = findSentencePart(message1, chainingWordIndex);
            const chainingWordIndex2 = message2.includes(chainingWord) ? message2.indexOf(chainingWord) : Math.floor(Math.random() * message2.length);
            const [sentence2, direction2] = findSentencePart(message2, chainingWordIndex2, (-1) * direction1);
            const combinedSentence = direction1 < 0 && direction2 > 0
                ? lodash.concat(sentence1, sentence2)
                : direction2 < 0 && direction1 > 0
                    ? lodash.concat(sentence2, sentence1)
                    : direction1 > 0 && direction2 > 0
                        ? lodash.concat(sentence1.slice(1), sentence2)
                        : lodash.concat(sentence2, sentence1.slice(0, sentence1.length - 1));
            console.log(direction1, direction2, formatSentence(combinedSentence));
        }
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

function findSentencePart(message: string[], index: number, direction?: number): [string[], number] {
    const sentence = [message[index]];
    if (direction === undefined)
        direction = Math.random() > 0.5 ? 1 : -1;
    if (index == 0)
        direction = 1;
    if (index == message.length - 1)
        direction = -1;

    while (sentence.length < 5 + Math.floor(Math.random() * 5)) {
        index += direction;
        if (index < 0 || index >= message.length)
            break;
        const word = message[index];
        if (TOP_WORDS.includes(word) && sentence.length > 3)
            break;
        if (word == '.' && sentence.length > 3)
            break;
        if (word != '.')
            if (direction > 0)
                sentence.push(word);
            else
                sentence.unshift(word);
    }
    return [sentence, direction];
}

function formatSentence(message: string[]): string {
    return lodash.upperFirst(message.join(' ')) + '.';
}
