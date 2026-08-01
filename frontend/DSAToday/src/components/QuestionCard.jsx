function getCompletedIds(question) {
  return (question.completedBy ?? []).map((entry) =>
    String(entry?._id ?? entry),
  );
}

function formatQuestionDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(dateValue))
    .toUpperCase();
}

function QuestionCard({
  currentUser,
  onToggleQuestion,
  question,
  users,
  featured = false,
}) {
  const completedIds = getCompletedIds(question);

  return (
    <article
      className={
        featured ? "question-card question-card--featured" : "question-card"
      }
    >
      <div className="question-card__head">
        <p className="question-date">
          {formatQuestionDate(question.createdAt)}
        </p>
        <a
          className="question-link"
          href={question.link}
          rel="noreferrer"
          target="_blank"
        >
          {question.title}
          <span aria-hidden="true"> Open ↗</span>
        </a>
      </div>

      <div className="status-list">
        {users.map((user) => {
          const isCompleted = completedIds.includes(String(user._id));
          const canToggle = String(currentUser?._id) === String(user._id);

          return (
            <label
              key={user._id}
              className={
                canToggle ? "status-row status-row--active" : "status-row"
              }
            >
              <span className="status-name">{user.name}</span>
              <input
                checked={isCompleted}
                disabled={!canToggle}
                onChange={() => {
                  if (canToggle) {
                    onToggleQuestion(question._id);
                  }
                }}
                type="checkbox"
              />
            </label>
          );
        })}
      </div>
    </article>
  );
}

export default QuestionCard;
