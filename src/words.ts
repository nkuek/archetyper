import { ISettings } from 'providers/WordProvider';

const words = [
  'the',
  'be',
  'of',
  'and',
  'a',
  'to',
  'in',
  'he',
  'have',
  'it',
  'that',
  'for',
  'they',
  'I',
  'with',
  'as',
  'not',
  'on',
  'she',
  'at',
  'by',
  'this',
  'we',
  'you',
  'do',
  'but',
  'from',
  'or',
  'which',
  'one',
  'would',
  'all',
  'will',
  'there',
  'say',
  'who',
  'make',
  'when',
  'can',
  'more',
  'if',
  'no',
  'man',
  'out',
  'other',
  'so',
  'what',
  'time',
  'up',
  'go',
  'about',
  'than',
  'into',
  'could',
  'state',
  'only',
  'new',
  'year',
  'some',
  'take',
  'come',
  'these',
  'know',
  'see',
  'use',
  'get',
  'like',
  'then',
  'first',
  'any',
  'work',
  'now',
  'may',
  'such',
  'give',
  'over',
  'think',
  'most',
  'even',
  'find',
  'day',
  'also',
  'after',
  'way',
  'many',
  'must',
  'look',
  'before',
  'great',
  'back',
  'through',
  'long',
  'where',
  'much',
  'should',
  'well',
  'people',
  'down',
  'own',
  'just',
  'because',
  'good',
  'each',
  'those',
  'feel',
  'seem',
  'how',
  'high',
  'too',
  'place',
  'little',
  'world',
  'very',
  'still',
  'nation',
  'hand',
  'old',
  'life',
  'tell',
  'write',
  'become',
  'here',
  'show',
  'house',
  'both',
  'between',
  'need',
  'mean',
  'call',
  'develop',
  'under',
  'last',
  'right',
  'move',
  'thing',
  'general',
  'school',
  'never',
  'same',
  'another',
  'begin',
  'while',
  'number',
  'part',
  'turn',
  'real',
  'leave',
  'might',
  'want',
  'point',
  'form',
  'off',
  'child',
  'few',
  'small',
  'since',
  'against',
  'ask',
  'late',
  'home',
  'interest',
  'large',
  'person',
  'end',
  'open',
  'public',
  'follow',
  'during',
  'present',
  'without',
  'again',
  'hold',
  'govern',
  'around',
  'possible',
  'head',
  'consider',
  'word',
  'program',
  'problem',
  'however',
  'lead',
  'system',
  'set',
  'order',
  'eye',
  'plan',
  'run',
  'keep',
  'face',
  'fact',
  'group',
  'play',
  'stand',
  'increase',
  'early',
  'course',
  'change',
  'help',
  'line',
];

const numbersList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const specialCharsList = ['"', '!', '?', ':', ';', '/', '(', '-', "'"];

const maxWords = 50;
const maxNumLength = 6;

const randomizeWords = (settings: ISettings, numWords: number) => {
  const { capitalChars, specialChars, numbers } = settings;

  const randomized = [];
  while (randomized.length < numWords) {
    let word = words[Math.floor(Math.random() * 200)];
    if (capitalChars) {
      const shouldCapitalize = Math.random() > 0.6;
      word = shouldCapitalize ? word[0].toUpperCase() + word.slice(1) : word;
    }
    if (specialChars) {
      const shouldAddSpecial = Math.random() > 0.4;
      if (shouldAddSpecial) {
        const specialChar =
          specialCharsList[Math.floor(Math.random() * specialCharsList.length)];
        switch (specialChar) {
          case '"':
          case "'":
            word = `${specialChar}${word}${specialChar}`;
            break;
          case '(':
            word = `(${word})`;
            break;
          default:
            word += specialChar;
        }
      }
    }
    if (numbers) {
      const shouldAddNumbers = Math.random() > 0.7;
      if (shouldAddNumbers) {
        const length = Math.random() * maxNumLength;
        let number = '';
        for (let i = 0; i < length; i++) {
          number += numbersList[Math.floor(Math.random() * 10)];
        }
        word = number;
      }
    }
    randomized.push(word);
  }
  return randomized;
};

export default randomizeWords;
