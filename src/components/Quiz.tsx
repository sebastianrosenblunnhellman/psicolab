'use client';

import { useState, useEffect } from 'react';

interface QuizQuestion {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
  explicacion: string;
}

interface QuizData {
  curso: string;
  leccion: string;
  preguntas: QuizQuestion[];
}

interface QuizProps {
  curso: string;
  leccion: string;
}

export default function Quiz({ curso, leccion }: QuizProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/quiz?curso=${curso}&leccion=${leccion}`);
        const data = await response.json();
        const matchingQuiz = data.find(
          (quiz: QuizData) => quiz.curso === curso && quiz.leccion === leccion
        );
        setQuizData(matchingQuiz || null);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [curso, leccion]);

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answer);
    if (!quizData) return;

    const currentQuestion = quizData.preguntas[currentQuestionIndex];
    const correct = answer === currentQuestion.respuestaCorrecta;
    setIsAnswerCorrect(correct);
    setShowExplanation(!correct);
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    
    if (currentQuestionIndex < quizData.preguntas.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswerCorrect(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsAnswerCorrect(false);
    }
  };

  if (!quizData) {
    return null;
  }

  const currentQuestion = quizData.preguntas[currentQuestionIndex];

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pregunta {currentQuestionIndex + 1} de {quizData.preguntas.length}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === quizData.preguntas.length - 1 || !selectedAnswer}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold mb-3">{currentQuestion.pregunta}</p>
        <div className="space-y-2">
          {currentQuestion.opciones.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
                ${selectedAnswer === option
                  ? showExplanation
                    ? option === currentQuestion.respuestaCorrecta
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    : 'bg-blue-100'
                  : 'hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                className="mr-3"
              />
              {option}
            </label>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              <span className="font-semibold">Respuesta correcta: </span>
              {currentQuestion.respuestaCorrecta}
            </p>
            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Explicación: </span>
              {currentQuestion.explicacion}
            </p>
          </div>
        )}

        {selectedAnswer && isAnswerCorrect && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-semibold">¡Correcto!</p>
          </div>
        )}
      </div>
    </div>
  );
}