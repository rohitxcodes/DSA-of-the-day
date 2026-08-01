import { useEffect, useState } from "react";

import AddQuestionModal from "./components/AddQuestionModal.jsx";
import Header from "./components/Header.jsx";
import Login from "./components/Login.jsx";
import QuestionList from "./components/QuestionList.jsx";
import SearchFilter from "./components/SearchFilter.jsx";

const storageKey = "dsaTodayUser";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(storageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function getCompletedIds(question) {
  return (question.completedBy ?? []).map((entry) =>
    String(entry?._id ?? entry),
  );
}

function isQuestionCompletedByUser(question, userId) {
  if (!userId) {
    return false;
  }

  return getCompletedIds(question).includes(String(userId));
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

function filterQuestions(questions, search, filter, currentUserId) {
  const query = search.trim().toLowerCase();

  return questions.filter((question) => {
    const matchesSearch =
      !query || question.title.toLowerCase().includes(query);
    const completed = isQuestionCompletedByUser(question, currentUserId);
    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && completed) ||
      (filter === "Pending" && !completed);

    return matchesSearch && matchesFilter;
  });
}

function App() {
  const [user, setUser] = useState(() => readStoredUser());
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(Boolean(readStoredUser()));
  const [authLoading, setAuthLoading] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [actionError, setActionError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    async function loadAppData() {
      setLoading(true);
      setError("");

      try {
        const [usersResponse, questionsResponse] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/questions"),
        ]);

        if (!usersResponse.ok || !questionsResponse.ok) {
          throw new Error("Unable to load app data.");
        }

        const [loadedUsers, loadedQuestions] = await Promise.all([
          usersResponse.json(),
          questionsResponse.json(),
        ]);

        if (!isActive) {
          return;
        }

        setUsers(loadedUsers);
        setQuestions(loadedQuestions);
      } catch {
        if (isActive) {
          setError("Could not load questions.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadAppData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const currentQuestion = questions[0] ?? null;
  const previousQuestions = questions.slice(1);
  const visibleQuestions = filterQuestions(
    previousQuestions,
    search,
    filter,
    user?._id,
  );
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter((question) =>
    isQuestionCompletedByUser(question, user?._id),
  ).length;
  const pendingQuestions = totalQuestions - completedQuestions;

  async function handleLogin(credentials) {
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Could not log in.");
      }

      localStorage.setItem(storageKey, JSON.stringify(responseData));
      setUser(responseData);
    } catch (loginError) {
      setAuthError(loginError.message || "Could not log in.");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(storageKey);
    setUser(null);
    setUsers([]);
    setQuestions([]);
    setLoading(false);
    setError("");
    setActionError("");
    setShowAddModal(false);
    setSearch("");
    setFilter("All");
  }

  function updateQuestionList(updatedQuestion) {
    setQuestions((currentQuestions) => {
      const nextQuestions = currentQuestions.filter(
        (question) => question._id !== updatedQuestion._id,
      );
      return [updatedQuestion, ...nextQuestions];
    });
  }

  async function handleAddQuestion(questionData) {
    setQuestionLoading(true);
    setActionError("");

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Could not add question.");
      }

      updateQuestionList(responseData);
      setShowAddModal(false);
    } catch (addError) {
      setActionError(addError.message || "Could not add question.");
    } finally {
      setQuestionLoading(false);
    }
  }

  async function handleToggleQuestion(questionId) {
    setActionError("");

    try {
      const response = await fetch(`/api/questions/${questionId}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Could not update question.");
      }

      updateQuestionList(responseData);
    } catch (toggleError) {
      setActionError(toggleError.message || "Could not update question.");
    }
  }

  if (!user) {
    return (
      <Login loading={authLoading} error={authError} onLogin={handleLogin} />
    );
  }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <Header
          completedQuestions={completedQuestions}
          pendingQuestions={pendingQuestions}
          onAddQuestion={() => setShowAddModal(true)}
          onLogout={handleLogout}
          totalQuestions={totalQuestions}
          user={user}
        />

        {error ? <p className="inline-error">{error}</p> : null}
        {actionError ? <p className="inline-error">{actionError}</p> : null}

        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <>
            <section className="section-block">
              <div className="section-head">
                <p className="section-kicker">Today</p>
                <h2>
                  {currentQuestion
                    ? formatQuestionDate(currentQuestion.createdAt)
                    : "No question yet"}
                </h2>
              </div>

              {currentQuestion ? (
                <QuestionList
                  currentUser={user}
                  questions={[currentQuestion]}
                  users={users}
                  onToggleQuestion={handleToggleQuestion}
                  renderAsFeatured
                />
              ) : (
                <div className="empty-state">
                  No question has been added yet.
                </div>
              )}
            </section>

            <section className="section-block">
              <div className="section-head section-head--stacked">
                <div>
                  <p className="section-kicker">All Questions</p>
                  <h2>Previous questions</h2>
                </div>
                <SearchFilter
                  filter={filter}
                  onFilterChange={setFilter}
                  onSearchChange={setSearch}
                  search={search}
                />
              </div>

              <QuestionList
                currentUser={user}
                emptyMessage="No matching questions."
                onToggleQuestion={handleToggleQuestion}
                questions={visibleQuestions}
                users={users}
              />
            </section>
          </>
        )}
      </div>

      {showAddModal ? (
        <AddQuestionModal
          error={questionLoading ? "" : actionError}
          loading={questionLoading}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddQuestion}
        />
      ) : null}
    </main>
  );
}

export default App;
