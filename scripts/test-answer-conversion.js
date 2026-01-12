// Test script to verify answer conversion logic
const questions = [
  {
    "question": "What is the main idea of the passage?",
    "options": [
      "The history of exercise",
      "The benefits of morning exercise",
      "How to drink water",
      "Why work is important"
    ],
    "answer": "The benefits of morning exercise"
  }
]

// Convert answer (text) to correctAnswer (index)
const processedQuestions = questions.map((q) => {
  let correctAnswer = q.correctAnswer
  
  // If correctAnswer doesn't exist but answer does, find the index
  if (correctAnswer === undefined && q.answer) {
    correctAnswer = q.options.findIndex((opt) => opt === q.answer)
  }
  
  return {
    ...q,
    correctAnswer: correctAnswer >= 0 ? correctAnswer : 0
  }
})

console.log('✅ Original answer:', questions[0].answer)
console.log('✅ Converted correctAnswer index:', processedQuestions[0].correctAnswer)
console.log('✅ Correct option text:', processedQuestions[0].options[processedQuestions[0].correctAnswer])
console.log('✅ Match:', questions[0].answer === processedQuestions[0].options[processedQuestions[0].correctAnswer])
