import { useState } from "react";

function AddQuestionModal({ error, loading, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit({ title, link });
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Add question"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow">Add question</p>
            <h2>New DSA question</h2>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Question title</span>
            <input
              className="text-input"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Two Sum"
              required
              value={title}
            />
          </label>

          <label className="field">
            <span>Question URL</span>
            <input
              className="text-input"
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://leetcode.com/problems/two-sum/"
              required
              type="url"
              value={link}
            />
          </label>

          {error ? (
            <p className="inline-error inline-error--form">{error}</p>
          ) : null}

          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="action-button" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddQuestionModal;
