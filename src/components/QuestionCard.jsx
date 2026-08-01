function UserCompletion({ user, isCompleted, isCurrentUser, onToggle }) {
  if (isCurrentUser) {
    return (
      <button
        type="button"
        className={`check-box ${isCompleted ? "is-complete" : ""}`}
        onClick={onToggle}
        aria-pressed={isCompleted}
        aria-label={`${user.name} completion`}
      >
        {isCompleted ? "✓" : ""}
      </button>
    );
  }

  return (
    <span
      className={`check-box is-readonly ${isCompleted ? "is-complete" : ""}`}
      aria-hidden="true"
    >
      {isCompleted ? "✓" : ""}
    </span>
  );
}

export default function QuestionCard({
  question,
  users,
  currentUser,
  onToggleCompletion,
}) {
  const completedIds = new Set(question.completedBy.map(String));

  return (
    <article className="question-card">
      <div className="question-topline">
        <div className="question-date">
          {new Date(question.createdAt)
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .toUpperCase()}
        </div>
        <a
          className="question-link"
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {question.title}
          <span className="link-arrow">Open ↗</span>
        </a>
      </div>

      <div className="user-grid">
        {users.map((user) => {
          const isCurrentUser = String(currentUser._id) === String(user._id);
          const isCompleted = completedIds.has(String(user._id));

          return (
            <div className="user-row" key={user._id}>
              <span className="user-name">{user.name}</span>
              <UserCompletion
                user={user}
                isCompleted={isCompleted}
                isCurrentUser={isCurrentUser}
                onToggle={
                  isCurrentUser
                    ? () => onToggleCompletion(question._id)
                    : undefined
                }
              />
            </div>
          );
        })}
      </div>
    </article>
  );
}
