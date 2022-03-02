import {
  IndexContext,
  InputContext,
  WordContext,
  WordListContext,
} from 'providers';
import { useContext } from 'react';

export const useInputLogic = () => {
  const { setUserInput, wpm, setInputHistory, userInput } =
    useContext(InputContext);
  const {
    currentWordIndex,
    currentCharIndex,
    userWordIndex,
    setCurrentCharIndex,
    setUserWordIndex,
    setCurrentWordIndex,
  } = useContext(IndexContext);
  const { charList } = useContext(WordListContext);
  const {
    setWpmData,
    wordBoxConfig: { incorrectChars },
    setWordBoxConfig,
    setHeatMapData,
  } = useContext(WordContext);

  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (currentWordIndex < Object.keys(charList).length) {
      const lastUserChar = e.target.value[e.target.value.length - 1];

      // handle space
      if (lastUserChar === ' ') {
        // if user presses space with no input, do nothing
        if (currentCharIndex === 0) {
          setUserInput('');
          return;
        }
        // if user presses space before reaching the end of the word, make entire word incorrect and remove other styling
        if (
          currentCharIndex !== charList[userWordIndex].chars.length ||
          e.target.value.length - 1 > charList[userWordIndex].chars.length
        ) {
          charList[userWordIndex].skipped = true;
          // loop over remaining chars and set skipped to true
          for (
            let i = currentCharIndex;
            i < charList[userWordIndex].length;
            i++
          ) {
            charList[userWordIndex].chars[i].skipped = true;
          }
        }

        let missingChars = 0;
        let extraChars = 0;

        charList[userWordIndex].chars.forEach((char) => {
          if (char.skipped) missingChars++;
          else if (char.extra) extraChars++;
        });

        const totalWordErrors = missingChars + incorrectChars;

        // set wpm data timestep
        setWpmData((prev) => ({
          ...prev,
          [userWordIndex]: {
            word: charList[userWordIndex].chars,
            wordNum: userWordIndex + 1,
            errors: totalWordErrors,
            wpm,
            missingChars,
            extraChars,
            incorrectChars,
          },
        }));

        // else move to next word
        setWordBoxConfig((prev) => ({
          ...prev,
          // add +1 for space
          charCount: prev.charCount + 1,
          incorrectChars: 0,
          uncorrectedErrors: prev.uncorrectedErrors + missingChars,
        }));
        setCurrentCharIndex(0);
        if (userWordIndex === currentWordIndex) {
          setCurrentWordIndex((prev) => prev + 1);
        }
        setUserWordIndex((prev) => prev + 1);
        setUserInput('');
        setInputHistory((prev) => [...prev, e.target.value]);
      } else {
        // move to next or previous character
        setCurrentCharIndex(e.target.value.length);

        // userInput is > target value only when deleting since userInput is one state behind
        if (userInput.length > e.target.value.length) return;

        setWordBoxConfig((prev) => ({
          ...prev,
          charCount: prev.charCount + 1,
        }));

        if (e.target.value.length <= charList[userWordIndex].length) {
          const currentChar =
            charList[userWordIndex].chars[e.target.value.length - 1];
          const isCorrect =
            e.target.value.length <= charList[userWordIndex].length &&
            lastUserChar === currentChar.char;

          currentChar.correct = isCorrect;

          if (!isCorrect) {
            setWordBoxConfig((prev) => ({
              ...prev,
              incorrectChars: prev.incorrectChars + 1,
              uncorrectedErrors: prev.uncorrectedErrors + 1,
            }));
            currentChar.mistyped = true;
            setHeatMapData((prev) => ({
              ...prev,
              [currentChar.char]: {
                correct: prev[currentChar.char]
                  ? prev[currentChar.char].correct
                  : 0,
                incorrect: prev[currentChar.char]
                  ? prev[currentChar.char].incorrect + 1
                  : 1,
              },
            }));
          } else {
            setHeatMapData((prev) => ({
              ...prev,
              [currentChar.char]: {
                correct: prev[currentChar.char]
                  ? prev[currentChar.char].correct + 1
                  : 1,
                incorrect: prev[currentChar.char]
                  ? prev[currentChar.char].incorrect
                  : 0,
              },
            }));
          }
        }

        // append extra letters to words if user types more letters
        else if (e.target.value.length > charList[userWordIndex].length) {
          charList[userWordIndex].chars.push({
            char: lastUserChar,
            correct: false,
            extra: true,
            skipped: false,
          });
          setWordBoxConfig((prev) => ({
            ...prev,
            uncorrectedErrors: prev.uncorrectedErrors + 1,
            incorrectChars: prev.incorrectChars + 1,
          }));
        }
      }
    }
  };
};
