import QuestionCard from "./QuestionCard";

export default function QuestionList({
  questions,
  users,
  currentUser,
  onToggleCompletion,
}) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="question-list">
      {questions.map((question) => (
        <QuestionCard
          key={question._id}
          question={question}
          users={users}
          currentUser={currentUser}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </div>
  );
}
