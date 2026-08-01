import { useEffect, useState } from "react";

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setLink("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedLink = link.trim();

    if (!trimmedTitle || !trimmedLink) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    try {
      await onSubmit({ title: trimmedTitle, link: trimmedLink });
    } catch (submissionError) {
      setError(submissionError.message || "Could not add question.");
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-question-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-question-title">Add Question</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Question Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Question URL</span>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
          </label>

          {error && <div className="state-text">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="text-button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSaving}
            >
              {isSaving ? "Adding..." : "Add Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
