import { useState } from "react";

function Login({ error, loading, onLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onLogin({ name, username });
  }

  return (
    <main className="app-shell app-shell--centered">
      <section className="panel login-panel">
        <div className="login-copy">
          <p className="eyebrow">DSA TODAY</p>
          <h1 className="app-title">Track today's question.</h1>
          <p className="muted">Enter your name and username to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input
              autoComplete="name"
              className="text-input"
              onChange={(event) => setName(event.target.value)}
              placeholder="Rohit Kumar"
              value={name}
            />
          </label>

          <label className="field">
            <span>Username</span>
            <input
              autoComplete="username"
              className="text-input"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="rohit"
              value={username}
            />
          </label>

          {error ? (
            <p className="inline-error inline-error--form">{error}</p>
          ) : null}

          <button
            className="action-button action-button--wide"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        <p className="muted auth-note">No password is required.</p>
      </section>
    </main>
  );
}

export default Login;
