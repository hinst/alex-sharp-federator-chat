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
            }
        }
        const sortedDictionary = lodash.sortBy(Object.entries(dictionary), entry => entry[1]).reverse();
        console.log(sortedDictionary);
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
    return words;
}

function isLetter(c: string) {
  return c.toString().toLowerCase() != c.toString().toUpperCase();
}

new App().run();