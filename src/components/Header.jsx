export default function Header({
  currentUser,
  onLogout,
  onAddQuestion,
  stats,
}) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">QUESTION OF THE DAY</p>
        <h1>Question of the Day</h1>
      </div>

      <div className="header-actions">
        <div className="meta-line">
          {stats.total} Questions · {stats.completed} Completed ·{" "}
          {stats.pending} Pending
        </div>
        <div className="user-strip">
          <span>Logged in as @{currentUser.username}</span>
          <button type="button" className="text-button" onClick={onLogout}>
            Logout
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={onAddQuestion}
          >
            Add Question
          </button>
        </div>
      </div>
    </header>
  );
}
