import QuestionCard from "./QuestionCard.jsx";

function QuestionList({
  currentUser,
  emptyMessage,
  onToggleQuestion,
  questions,
  renderAsFeatured = false,
  users,
}) {
  if (!questions.length) {
    return (
      <div className="empty-state">{emptyMessage || "No questions found."}</div>
    );
  }

  return (
    <div className="question-stack">
      {questions.map((question, index) => (
        <QuestionCard
          currentUser={currentUser}
          featured={renderAsFeatured && index === 0}
          key={question._id}
          onToggleQuestion={onToggleQuestion}
          question={question}
          users={users}
        />
      ))}
    </div>
  );
}

export default QuestionList;
