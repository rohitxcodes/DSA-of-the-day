import { useState } from "react";

export default function Login({ onSubmit, isLoading, error }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();

    if (!trimmedName || !trimmedUsername) {
      setFormError("Name and username are required.");
      return;
    }

    setFormError("");
    try {
      await onSubmit({ name: trimmedName, username: trimmedUsername });
    } catch (submissionError) {
      setFormError(submissionError.message || "Could not sign in");
    }
  };

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="eyebrow">QUESTION OF THE DAY</p>
        <h1>Question of the Day</h1>

        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span>Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </label>

        {(formError || error) && (
          <div className="state-text">{formError || error}</div>
        )}

        <button
          type="submit"
          className="primary-button full-width"
          disabled={isLoading}
        >
          {isLoading ? "Continuing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
