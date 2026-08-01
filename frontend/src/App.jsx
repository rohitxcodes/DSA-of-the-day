import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import AddQuestionModal from "./components/AddQuestionModal";
import SearchFilter from "./components/SearchFilter";
import QuestionList from "./components/QuestionList";

const STORAGE_KEY = "qotd-user";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [isAuthing, setIsAuthing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [usersResponse, questionsResponse] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/questions"),
        ]);

        if (!usersResponse.ok || !questionsResponse.ok) {
          throw new Error("Failed to load data");
        }

        const [usersData, questionsData] = await Promise.all([
          usersResponse.json(),
          questionsResponse.json(),
        ]);

        setUsers(usersData);
        setQuestions(questionsData);
      } catch {
        setError("Could not load questions.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleLogin = async ({ name, username }) => {
    setIsAuthing(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Could not sign in");
      }

      const user = await response.json();
      setCurrentUser(user);
      setUsers((existingUsers) => {
        const found = existingUsers.some((entry) => entry._id === user._id);
        return found ? existingUsers : [...existingUsers, user];
      });
    } catch (loginError) {
      setError(loginError.message || "Could not sign in");
      throw loginError;
    } finally {
      setIsAuthing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  };

  const handleAddQuestion = async ({ title, link }) => {
    setIsSavingQuestion(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, link }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Could not add question");
      }

      const question = await response.json();
      setQuestions((existingQuestions) => [question, ...existingQuestions]);
      setIsAddOpen(false);
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleToggleCompletion = async (questionId) => {
    if (!currentUser) {
      return;
    }

    const userId = currentUser._id;

    setQuestions((existingQuestions) =>
      existingQuestions.map((question) => {
        if (question._id !== questionId) {
          return question;
        }

        const completedBy = new Set(question.completedBy.map(String));
        if (completedBy.has(userId)) {
          completedBy.delete(userId);
        } else {
          completedBy.add(userId);
        }

        return {
          ...question,
          completedBy: Array.from(completedBy),
        };
      }),
    );

    try {
      const response = await fetch("/api/toggle-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questionId, userId }),
      });

      if (!response.ok) {
        throw new Error("Could not update completion");
      }

      const updatedQuestion = await response.json();
      setQuestions((existingQuestions) =>
        existingQuestions.map((question) =>
          question._id === updatedQuestion._id ? updatedQuestion : question,
        ),
      );
    } catch {
      setError("Could not update completion.");
      setQuestions((existingQuestions) =>
        existingQuestions.map((question) => {
          if (question._id !== questionId) {
            return question;
          }

          const completedBy = new Set(question.completedBy.map(String));
          if (completedBy.has(userId)) {
            completedBy.delete(userId);
          } else {
            completedBy.add(userId);
          }

          return {
            ...question,
            completedBy: Array.from(completedBy),
          };
        }),
      );
    }
  };

  const visibleQuestions = useMemo(() => {
    const currentUserId = currentUser?._id ? String(currentUser._id) : "";
    const query = search.trim().toLowerCase();

    return questions.filter((question) => {
      const titleMatch = question.title.toLowerCase().includes(query);
      if (!titleMatch) {
        return false;
      }

      if (!currentUserId || filter === "all") {
        return true;
      }

      const completed = question.completedBy
        .map(String)
        .includes(currentUserId);
      if (filter === "completed") {
        return completed;
      }

      if (filter === "pending") {
        return !completed;
      }

      return true;
    });
  }, [currentUser, filter, questions, search]);

  const stats = useMemo(() => {
    const currentUserId = currentUser?._id ? String(currentUser._id) : "";
    const completed = currentUserId
      ? questions.filter((question) =>
          question.completedBy.map(String).includes(currentUserId),
        ).length
      : 0;

    return {
      total: questions.length,
      completed,
      pending: Math.max(questions.length - completed, 0),
    };
  }, [currentUser, questions]);

  const todaysQuestion = visibleQuestions[0] || null;
  const previousQuestions = visibleQuestions.slice(1);

  if (!currentUser) {
    return <Login onSubmit={handleLogin} isLoading={isAuthing} error={error} />;
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onAddQuestion={() => setIsAddOpen(true)}
          stats={stats}
        />

        <main className="app-main">
          <section className="section-block">
            <div className="section-title-row">
              <h2>Today&apos;s Question</h2>
            </div>
            {isLoading ? (
              <div className="state-text">Loading questions...</div>
            ) : error ? (
              <div className="state-text">{error}</div>
            ) : questions.length === 0 ? (
              <div className="state-text">
                No questions yet. Add the first question.
              </div>
            ) : todaysQuestion ? (
              <QuestionList
                questions={[todaysQuestion]}
                users={users}
                currentUser={currentUser}
                onToggleCompletion={handleToggleCompletion}
              />
            ) : (
              <div className="state-text">No matching questions.</div>
            )}
          </section>

          <section className="section-block">
            <div className="section-title-row">
              <h2>Previous Questions</h2>
              <SearchFilter
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
            {isLoading ? (
              <div className="state-text">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="state-text">
                No questions yet. Add the first question.
              </div>
            ) : previousQuestions.length === 0 ? (
              <div className="state-text">No previous questions yet.</div>
            ) : (
              <QuestionList
                questions={previousQuestions}
                users={users}
                currentUser={currentUser}
                onToggleCompletion={handleToggleCompletion}
              />
            )}
          </section>
        </main>
      </div>

      <AddQuestionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddQuestion}
        isSaving={isSavingQuestion}
      />
    </div>
  );
}
