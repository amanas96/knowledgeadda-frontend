import { useState } from "react";

export default function useQuizQuestions() {
  const [questions, setQuestions] = useState([]);
  const [jsonError, setJsonError] = useState("");

  const addQuestion = (questionForm) => {
    const { text, optionA, optionB, optionC, optionD, correctAnswer } =
      questionForm;

    if (!text || !optionA || !optionB || !optionC || !optionD) {
      alert("Please fill all question fields.");
      return;
    }

    const options = [optionA, optionB, optionC, optionD];
    const correctAnswerText = options[correctAnswer.charCodeAt(0) - 65];

    setQuestions((prev) => [
      ...prev,
      {
        text,
        options,
        correctAnswer: correctAnswerText,
        marks: Number(questionForm.marks),
        explanation: questionForm.explanation,
      },
    ]);
  };

  const importJsonQuestions = (jsonInput) => {
    setJsonError("");
    let parsed;

    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setJsonError("Invalid JSON format.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setJsonError("JSON must be an array.");
      return;
    }

    setQuestions((prev) => [...prev, ...parsed]);
  };

  return {
    questions,
    setQuestions,
    addQuestion,
    importJsonQuestions,
    jsonError,
  };
}
