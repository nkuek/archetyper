import { ISettings } from 'providers/SettingsProvider';
import english from './english.json';
import vietnamese from './vietnamese.json';
import spanish from './spanish.json';
import englishMisspellings from './englishMisspellings.json';

export const languageMap = {
  english,
  'english - commonly misspelled': englishMisspellings,
  spanish,
  vietnamese,
};

const numbersList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const specialCharsList = ['"', '!', '?', ':', ';', '/', '(', '-', "'"];

const maxNumLength = 6;
export const maxWords = 40;

// create overload function based on the single parameter
function randomizeWords(settings: ISettings, single: boolean): string;
function randomizeWords(settings: ISettings): string[];

function randomizeWords(settings: ISettings, single?: boolean) {
  const { capitalChars, specialChars, numbers, language } = settings;

  const words = languageMap[language];
  const createWord = () => {
    let word = words[Math.floor(Math.random() * words.length)];
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
    return word;
  };

  if (single) {
    return createWord();
  }

  const randomized: string[] = [];
  while (randomized.length < maxWords) {
    randomized.push(createWord());
  }
  return randomized;
}

export default randomizeWords;
