import { KeyboardEvent, useContext } from 'react';
import {
  IndexContext,
  InputContext,
  WordContext,
  WordListContext,
} from 'providers';
import { TWordChar } from 'providers/WordListProvider';

export const useKeyDownLogic = () => {
  const {
    setWordBoxConfig,
    wordBoxConfig: { uncorrectedErrors },
    wpmData,
  } = useContext(WordContext);
  const { setUserWordIndex, userWordIndex, currentCharIndex } =
    useContext(IndexContext);
  const { setInputHistory, inputHistory, setUserInput } =
    useContext(InputContext);
  const { charList } = useContext(WordListContext);

  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const decrementErrors = () => {
        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors: prev.uncorrectedErrors - 1,
        }));
      };

      const decrementWord = () => {
        setUserWordIndex((prev) => prev - 1);
        charList[userWordIndex - 1].skipped = false;
        setInputHistory((prev) => prev.slice(0, prev.length - 1));
      };

      const resetWord = (index: number) => {
        let newUncorrectErrors = uncorrectedErrors;
        charList[index].chars.forEach((char) => {
          if ((char.correct !== null && !char.correct) || char.extra) {
            newUncorrectErrors--;
          }
        });
        const baseWord = charList[index].chars.filter((char) => !char.extra);

        const resetWord: TWordChar[] = baseWord.map((char) => ({
          correct: null,
          char: char.char,
          skipped: false,
        }));

        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors: newUncorrectErrors,
          incorrectChars: 0,
        }));

        charList[index].chars = resetWord;
      };

      const previousWord = inputHistory[userWordIndex - 1];

      // deleting entire word
      if (e.getModifierState('Alt') || e.getModifierState('Meta')) {
        // if at the beginning of a word, delete entire previous word
        if (currentCharIndex === 0 && userWordIndex > 0) {
          resetWord(userWordIndex - 1);
          decrementWord();
          // else delete just current word
        } else {
          resetWord(userWordIndex);
        }
        // move back one word if backspacing at the beginning of a word
      } else if (currentCharIndex === 0 && userWordIndex > 0) {
        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors:
            prev.uncorrectedErrors -
            // subtract 1 to account for the space
            (charList[userWordIndex - 1].chars.length -
              (previousWord.length - 1)),
          incorrectChars: wpmData[userWordIndex - 1].incorrectChars,
        }));

        decrementWord();

        setUserInput(inputHistory[userWordIndex - 1]);
        // if deleting an extra character, remove it from the charList
      } else {
        if (currentCharIndex > charList[userWordIndex].length) {
          charList[userWordIndex].chars = charList[userWordIndex].chars.slice(
            0,
            charList[userWordIndex].chars.length - 1
          );
          // otherwise just decrement the num errors and update correct state
        } else if (currentCharIndex > 0) {
          charList[userWordIndex].chars[currentCharIndex - 1].correct = null;
          if (
            !charList[userWordIndex].chars[currentCharIndex - 1].correct ||
            charList[userWordIndex].chars[currentCharIndex - 1].extra
          ) {
            decrementErrors();
          }
        }
      }
    }
  };
};
