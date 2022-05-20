import fs from 'fs';
import lodash from 'lodash';
import { Message } from './Message';

class App {
    myId = 'user718097882';

    run() {
        const dictionary: {[word: string]: number} = {};

        const messages: Message[] = JSON.parse(
            fs.readFileSync('./telegram-data/result.json').toString()
        ).messages;
        for (const message of messages) {
            if (message.from_id == this.myId && message.text) {
                const words = getWords(message.text);
                for (const word of words) {
                    dictionary[word] = (dictionary[word] || 0) + 1;
                }
                console.log(words);
            }
        }
        const sortedDictionary = lodash.sortBy(Object.entries(dictionary), entry => entry[1]).reverse();
        console.log(sortedDictionary);

        const topWords = sortedDictionary.slice(0, 100).map(entry => entry[0]);
        fs.writeFileSync('../chatbot/src/data/topWords.js',
            'export default topWords = ' + JSON.stringify(topWords) + ';');
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

        if (isChainBreaker(character))
            if (words.length && isLetter(words[words.length - 1]))
                words.push('.');
    }
    if (word.length)
        words.push(word);
    return words;
}

function isLetter(text: string) {
    return text.toString().toLowerCase() != text.toString().toUpperCase();
}

function isChainBreaker(text: string) {
    return [';', '.', ':', '!', '?'].includes(text);
}

new App().run();