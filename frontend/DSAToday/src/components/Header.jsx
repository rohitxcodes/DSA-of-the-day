function Header({
  completedQuestions,
  onAddQuestion,
  onLogout,
  pendingQuestions,
  totalQuestions,
  user,
}) {
  return (
    <header className="header-panel">
      <div>
        <p className="eyebrow">DSA TODAY</p>
        <h1 className="app-title">Daily DSA question tracker</h1>
        <p className="muted copy-line">
          Track the newest question and the full history in one compact view.
        </p>
      </div>

      <div className="header-meta">
        <p className="stats-line">
          {totalQuestions} Questions · {completedQuestions} Completed ·{" "}
          {pendingQuestions} Pending
        </p>

        <div className="header-actions">
          <span className="user-chip">Logged in as @{user.username}</span>
          <button
            className="action-button"
            type="button"
            onClick={onAddQuestion}
          >
            + Add Question
          </button>
          <button className="ghost-button" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>

        <p className="muted auth-note">
          Username-based login is identification only, not secure
          authentication.
        </p>
      </div>
    </header>
  );
}

export default Header;
