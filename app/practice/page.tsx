"use client";
import { useState } from "react";
import data from "./data.json";

type Question = {
  STT: string;
  "Nội dung câu hỏi": string;
  "ĐÁP ÁN ĐÚNG": number;
  "Câu trả lời 1": string;
  "Câu trả lời 2": string;
  "Câu trả lời 3": string;
  "Câu trả lời 4": string;
  "Tham chiếu": string;
  "Mảng nghiệp vụ": string;
  answer: boolean[];
};

const Practice = () => {
  const [questions, setQuestions] = useState<Question[]>(loadQuestion());
  console.log(questions);

  const [currentQuestIdx, setQuestionIdx] = useState(0);

  const result = questions.reduce((acc, q, idx) => {
    const theCorrectAnswerArray = q["ĐÁP ÁN ĐÚNG"].toString().replaceAll(" ", "").split(",").map((i) => parseInt(i));
    const correctBoolean = [false,false,false,false].map((i, idx) => theCorrectAnswerArray.includes(idx + 1));
    console.log(correctBoolean, q["ĐÁP ÁN ĐÚNG"]);
    // console.log(correctBoolean, q.answer);

    if (correctBoolean.every((i, idx) => i === q.answer[idx])){
      return acc + 1;
    }
    return acc;
  }, 0);

  console.log('result', result);

  return (
    <div className="p-20 text-black">
      <button onClick={() => {
        setQuestions(loadQuestion());
        setQuestionIdx(0);
      }} className={`${secondaryBtnClassName}`}>Thi Lai</button>
      <div>
        {currentQuestIdx < questions.length && currentQuestIdx > -1 ? (
          <>
            <h1>Question number: {currentQuestIdx + 1}</h1>
            <Question onChange={q => {
                const newQuestions = questions.map((i, idx) => {
                    if (idx === currentQuestIdx) {
                        return q;
                    }
                    return i;
                })
                setQuestions(newQuestions);
            }} question={questions[currentQuestIdx]} />
            {
              currentQuestIdx > 0 && <button className={`${secondaryBtnClassName}`} onClick={() => setQuestionIdx(currentQuestIdx - 1)}>
              Câu Trước
            </button> 
            }
            <button className={`${secondaryBtnClassName}`} onClick={() => setQuestionIdx(currentQuestIdx + 1)}>
              Câu tiếp theo
            </button>
          </>
        ) : (
          <div>
            <p>Finish</p>
            <p>Kết quả: {`${result}/${questions.length}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const secondaryBtnClassName = "mt-6 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"

const Question = ({
  question,
  onChange,
}: {
  question: Question;
  onChange: (_q: Question) => void;
}) => {
  return (
    <>
      <p>{question["Nội dung câu hỏi"]}</p>
      <div>
        <input
          onChange={(e) =>
            onChange({
              ...question,
              answer: [
                e.target.checked,
                question.answer[0],
                question.answer[2],
                question.answer[3],
              ],
            })
          }
          type="checkbox"
          id="option1"
          name="option1"
          checked={question.answer[0]}
        //   value={question.answer[0] ? "true" : "false"}
        />
        <label className="text-black" htmlFor="option1">{question["Câu trả lời 1"]}</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="option2"
          name="option2"
        //   value={question.answer[1] ? "true" : "false"}
          checked={question.answer[1]}
          onChange={(e) =>
            onChange({
              ...question,
              answer: [
                question.answer[0],
                e.target.checked,
                question.answer[2],
                question.answer[3],
              ],
            })
          }
        />
        <label htmlFor="option2">{question["Câu trả lời 2"]}</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="option3"
          name="option3"
        //   value={question.answer[2] ? "true" : "false"}
          checked={question.answer[2]}
          onChange={(e) =>
            onChange({
              ...question,
              answer: [
                question.answer[0],
                question.answer[1],
                e.target.checked,
                question.answer[3],
              ],
            })
          }
        />
        <label htmlFor="option3">{question["Câu trả lời 3"]}</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="option4"
          name="option4"
        //   value={question.answer[3] ? "true" : "false"}
          checked={question.answer[3]}
          onChange={(e) =>
            onChange({
              ...question,
              answer: [
                question.answer[0],
                question.answer[1],
                question.answer[2],
                e.target.checked,
              ],
            })
          }
        />
        <label htmlFor="option4">{question["Câu trả lời 4"]}</label>
      </div>
    </>
  );
};

const loadQuestion = (): Question[] => {
  return data.map((i) => ({ ...i, answer: [false, false, false, false] }));
};

export default Practice;
