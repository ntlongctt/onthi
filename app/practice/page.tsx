"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import data from "./data.json";
import { on } from "events";

type Question = {
  STT: string;
  "Nội dung câu hỏi": string;
  "ĐÁP ÁN ĐÚNG": number | string;
  "Câu trả lời 1": string;
  "Câu trả lời 2": string;
  "Câu trả lời 3": string;
  "Câu trả lời 4": string;
  "Tham chiếu": string;
  "Mảng nghiệp vụ": string;
  answer: boolean[];
  _submitted: boolean;
};

const Practice = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  console.log(questions);

  const [currentQuestIdx, setQuestionIdx] = useState(0);

  const getResults = useCallback(() => {
    return questions.reduce((acc, q, idx) => {
      const theCorrectAnswerArray = q["ĐÁP ÁN ĐÚNG"]
        .toString()
        .replaceAll(" ", "")
        .split(",")
        .map((i) => parseInt(i));
      const correctBoolean = [false, false, false, false].map((i, idx) =>
        theCorrectAnswerArray.includes(idx + 1)
      );
      console.log(correctBoolean, q["ĐÁP ÁN ĐÚNG"]);
      // console.log(correctBoolean, q.answer);

      if (correctBoolean.every((i, idx) => i === q.answer[idx])) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [questions]);

  useEffect(() => {
    const _q = loadQuestion();
    setQuestionIdx(0);
    setQuestions(_q);
  }, []);

  return (
    <div className="p-20 text-black">
      <button
        onClick={() => {
          setQuestions(loadQuestion());
          setQuestionIdx(0);
        }}
        className={`${secondaryBtnClassName}`}
      >
        Thi Lai
      </button>
      <div>
        {currentQuestIdx < questions.length && currentQuestIdx > -1 ? (
          <div className="flex flex-col gap-4">
            <h1>Câu hỏi {`${currentQuestIdx + 1}/100`}</h1>
            <Question
              onChange={(q) => {
                const newQuestions = questions.map((i, idx) => {
                  if (idx === currentQuestIdx) {
                    return q;
                  }
                  return i;
                });
                setQuestions(newQuestions);
              }}
              onNext={() => setQuestionIdx(currentQuestIdx + 1)}
              onPrev={() => setQuestionIdx(currentQuestIdx - 1)}
              question={questions[currentQuestIdx]}
            />
          </div>
        ) : (
          <div>
            <p>Finish</p>
            <p>Kết quả: {`${getResults()}/${questions.length}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const secondaryBtnClassName =
  "mt-6 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800";

const Question = ({
  question,
  onChange,
  onNext,
  onPrev,
}: {
  question: Question;
  onChange: (_q: Question) => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [showAnswer, setShowAnswer] = useState(false);


  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    onChange({
      ...question,
      answer: fillAnswer(e.target.checked, idx, question),
    });
  };

  const checkAnswer = () => {
    onChange({ ...question, _submitted: true });
  };

  const goNextQuestion = () => {
    onNext();
  };

  useEffect(() => {
    setShowAnswer(false);
  }, [question.STT]);

  return (
    <div>
      <p className="mb-6">{question["Nội dung câu hỏi"]}</p>
      <div className="flex flex-col gap-4">
        {[
          question["Câu trả lời 1"],
          question["Câu trả lời 2"],
          question["Câu trả lời 3"],
          question["Câu trả lời 4"],
        ].map((i, idx) => {
          return (
            <div key={idx} className="flex items-center mb-4">
              <input
                onChange={(e) => handleAnswerChange(e, idx)}
                type="checkbox"
                id={`option${idx}`}
                name={`option${idx}`}
                className="h-4 min-w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={question.answer[idx]}
                disabled={question._submitted}
              />
              <label
                className={`ms-2 text-sm font-medium ${getQuestionLabelColor(question._submitted, question["ĐÁP ÁN ĐÚNG"], idx)}`}
                htmlFor={`option${idx}`}
              >
                {i}
              </label>
            </div>
          );
        })}
      </div>
      {/* <div>
        <button
          onClick={() => setShowAnswer((s) => !s)}
          className={secondaryBtnClassName}
        >
          Hien ket qua
        </button>
        {showAnswer && <span>{question["ĐÁP ÁN ĐÚNG"]}</span>}
      </div> */}
      <div>
        <div className="flex justify-end">
          <button className={`${secondaryBtnClassName}`} onClick={onPrev}>
            Câu Trước
          </button>
          {question._submitted ? (
            <button
              className={`${secondaryBtnClassName}`}
              onClick={goNextQuestion}
            >
              Câu tiếp theo
            </button>
          ) : (
            <button
              className={`${secondaryBtnClassName}`}
              onClick={checkAnswer}
            >
              Câu tiếp theo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const getQuestionLabelColor = (submitted: boolean, answer: string | number, optionIdx: number ) => {
  if (!submitted) {
    return "text-black";
  }

  if (answer.toString().includes((optionIdx + 1).toString())) {
    return "text-green-600";
  }
}

const fillAnswer = (checked: boolean, idx: number, question: Question) => {
  return question.answer.map((i, _idx) => {
    if (idx === _idx) {
      return checked;
    }
    return i;
  });
};

const loadQuestion = (): Question[] => {
  // Shuffle array
  const shuffled = data.sort(() => 0.5 - Math.random());

  // Get sub-array of first 100 elements after shuffled
  let selected = shuffled.slice(0, 100);

  return selected.map((i) => ({
    ...i,
    answer: [false, false, false, false],
    _submitted: false,
  }));
};

export default Practice;
