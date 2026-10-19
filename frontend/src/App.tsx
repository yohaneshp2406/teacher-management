import "./App.css"
import { useState } from "react";
import KpiCards from "./components/KpiCards"
import ScoreReport from "./components/ScoreReport"
import TeacherList from "./components/TeacherList"
import TeacherDashboard from "./components/TeacherDashboard"
import AddTeacherForm from "./components/AddTeacherForm"
import UpdateTeacherForm from "./components/UpdateTeacherForm"
import DeleteTeacherForm from "./components/DeleteTeacherForm"

function App() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginMessage, setLoginMessage] = useState("")
  const [accessToken, setAccessToken] = useState("")

  const [teacherForm, setTeacherForm] = useState({
    name: "",
    score: ""
  })
  const [teacherMessage, setTeacherMessage] = useState("")

  const [updateId, setUpdateId] = useState("")
  const [updateName, setUpdateName] = useState("")
  const [updateScore, setUpdateScore] = useState("")
  const [updateMessage, setUpdateMessage] = useState("")

  const [deleteId, setDeleteId] = useState("")
  const [deleteMessage, setDeleteMessage] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [scoreFilter, setScoreFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

  const [currentPage, setCurrentPage] = useState(1)

  const [teacherError, setTeacherError] = useState("")

  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false)

  const [hasLoadedTeachers, setHasLoadedTeachers] = useState(false)

  const teachersPerPage = 3

  type User = {
    id: number
    name: string
    email: string
    role: string
  }

  const [user, setUser] = useState<User | null>(null)

  type Teacher = {
    id: number
    name: string
    score: number
  }

  const [teachers, setTeachers] = useState<Teacher[]>([])

  const handleRegister = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const response = await fetch(
      "http://localhost:3000/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setMessage(data.message || "Registration failed")
      return
    }

    setMessage(data.message || "User registered successfully")

    setName("")
    setEmail("")
    setPassword("")
  }

  const handleLogin = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const response = await fetch(
      "http://localhost:3000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setLoginMessage(data.message || "Login failed")
      return
    }

    setLoginMessage(data.message)
    setAccessToken(data.accessToken)
    setUser(data.user)
  }

  const handleTeacherChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {name, value} = event.target

    setTeacherForm({
      ...teacherForm,
      [name]: value
    })
  }

  const handleAddTeacher = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!teacherForm.name.trim()) {
      setTeacherMessage("Teacher name is required")
      return
    }

    if (!teacherForm.score) {
      setTeacherMessage("Score is required")
      return
    }

    const score = Number(teacherForm.score)

    if (score < 0 || score > 100) {
      setTeacherMessage("Score must be between 0 and 100")
      return
    }

    setTeacherMessage("")

    try {
      const response = await fetch(
        "http://localhost:3000/teachers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            name: teacherForm.name,
            score: score
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setTeacherMessage(data.message || "Failed to add teacher")
        return
      }

      setTeacherMessage("Teacher added")
      setTeacherForm({
        name: "",
        score: ""
      })

      await loadTeachers()
    } catch (error) {
      if (error instanceof Error) {
        setTeacherMessage(`Network error: ${error.message}`)
      } else {
        setTeacherMessage("Inknown error occurred")
      }
    }
  }

  const loadTeachers = async () => {
    setTeacherError("")
    setIsLoadingTeachers(true)

    try {
      const response = await fetch(
        "http://localhost:3000/teachers",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error("Failed to load teachers")
      }

      const data = await response.json()
      setTeachers(data)
      setHasLoadedTeachers(true)

    } catch (error) {
      if (error instanceof Error) {
        setTeacherError(error.message)
      } else {
        setTeacherError("Unknown error occurred")
      }
    } finally {
      setIsLoadingTeachers(false)
    }
  }

  const handleUpdateTeacher = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setUpdateMessage("")

    try {
      const response = await fetch(
        `http://localhost:3000/teachers/${updateId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            name: updateName,
            score: Number(updateScore)
          })
        }
      )

      const data = await response.json()

      if(!response.ok) {
        setUpdateMessage(data.message || "Failed to update teacher")
        return
      }

      setUpdateMessage("Teacher updated")

      await loadTeachers()
    } catch (error) {
      if (error instanceof Error) {
        setUpdateMessage(`Network error: ${error.message}`)
      } else {
        setUpdateMessage("Unknown error occurred")
      }
    }
  }

  const handleDeleteTeacher = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setDeleteMessage("")

    try {
      const response = await fetch(
        `http://localhost:3000/teachers/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setDeleteMessage(data.message || "Failed to delete teacher")
        return
      }

      setDeleteMessage("Teacher deleted")
      setDeleteId("")

      await loadTeachers()
    } catch (error) {
      if (error instanceof Error) {
        setDeleteMessage(`Network error: ${error.message}`)
      } else {
        setDeleteMessage("Unknown error occurred")
      }
    }
  }

  const filteredTeachers = teachers
  .filter((teacher) =>
    teacher.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .filter((teacher) => {
    if (scoreFilter === "90plus") {
      return teacher.score >= 90
    }

    if (scoreFilter === "80to89") {
      return teacher.score >= 80 && teacher.score < 90
    }

    if (scoreFilter === "below80") {
      return teacher.score < 80
    }

    return true
  })

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name)
    }

    if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name)
    }

    if (sortBy === "score-asc") {
      return a.score - b.score
    }

    if (sortBy === "score-desc") {
      return b.score - a.score
    }

    return 0
  })

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTeachers.length / teachersPerPage)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const startIndex =
    (safeCurrentPage - 1) * teachersPerPage

  const paginatedTeachers = sortedTeachers.slice(
    startIndex,
    startIndex + teachersPerPage
  )

  const totalTeachers = teachers.length

  const averageScore =
    teachers.length > 0
      ? teachers.reduce(
          (total, teacher) => total + teacher.score,
          0
        ) / teachers.length
      : 0

  const highestScore =
    teachers.length > 0
      ? Math.max(...teachers.map((teacher) => teacher.score))
      : 0

  const highPerformers = teachers.filter(
    (teacher) => teacher.score >= 90
  ).length

  const excellentTeachers = teachers.filter(
  (teacher) => teacher.score >= 90
  ).length

  const goodTeachers = teachers.filter(
    (teacher) =>
      teacher.score >= 80 &&
      teacher.score < 90
  ).length

  const needsSupportTeachers = teachers.filter(
    (teacher) => teacher.score < 80
  ).length

  const handleLogout = () => {
    setUser(null)
    setAccessToken("")
    setTeachers([])
    setHasLoadedTeachers(false)
    setLoginMessage("")
  }

return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event?.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">
          Register
        </button>

        <p>{message}</p>
      </form>

      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(event) => setLoginEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(event) => setLoginPassword(event.target.value)}
        />

        <button type="submit">
          Login
        </button>

        <p>{loginMessage}</p>
        <p>
          Token: {accessToken ? "Available" : "Not available"}
        </p>

        <p>Role: {user ? user.role : "Not logged in"}</p>

        {user?.role === "user" && (
          <p>User Area</p>
        )}

        {user?.role === "manager" && (
          <p>Manager Area</p>
        )}

        {user?.role === "admin" && (
          <p>Admin Area</p>
        )}

        {user?.role === "admin" && (
          <button type="button">
            Admin Panel
          </button>
        )}

        {user?.role === "admin" && (
          <button type="button">
            Manage Users
          </button>
        )}
      </form>

      {user && (
        <TeacherDashboard user={user}>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>

          <hr />

          <div className="teacher-controls">
            <button type="button" onClick={loadTeachers} disabled={isLoadingTeachers}>
              {isLoadingTeachers ? "Loading..." : "Load Teachers"}
            </button>

            {isLoadingTeachers && (
              <p>Loading teachers...</p>
            )}

            {teacherError && (
              <p style={{ color: "red" }}>
                Error: {teacherError}
              </p>
            )}

            <input
              type="text"
              placeholder="Search teacher..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}
            />

            <select
              value={scoreFilter}
              onChange={(event) => {
                setScoreFilter(event.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="all">All Scores</option>
              <option value="90plus">90+</option>
              <option value="80to89">80 - 89</option>
              <option value="below80">Below 80</option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="score-asc">Score Low-High</option>
              <option value="score-desc">Score High-Low</option>
            </select>
          </div>

          <KpiCards
            totalTeachers={totalTeachers}
            averageScore={averageScore}
            highestScore={highestScore}
            highPerformers={highPerformers}
          />

          <ScoreReport
            excellentTeachers={excellentTeachers}
            goodTeachers={goodTeachers}
            needsSupportTeachers={needsSupportTeachers}
            totalTeachers={totalTeachers}
          />

          <TeacherList teachers={paginatedTeachers} />

          {hasLoadedTeachers &&
            !isLoadingTeachers &&
            !teacherError &&
            sortedTeachers.length === 0 && (
              <p>No teachers found</p>
          )}

          <button
            type="button"
            onClick={() => setCurrentPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
          >
            Next
          </button>
        </TeacherDashboard>
      )}

      {(user?.role === "manager" || user?.role === "admin") && (
        <AddTeacherForm
          teacherForm={teacherForm}
          teacherMessage={teacherMessage}
          onChange={handleTeacherChange}
          onSubmit={handleAddTeacher}
        />
      )}

      {(user?.role === "manager" || user?.role === "admin") && (
        <UpdateTeacherForm
          updateId={updateId}
          updateName={updateName}
          updateScore={updateScore}
          updateMessage={updateMessage}
          onIdChange={(event) => setUpdateId(event.target.value)}
          onNameChange={(event) => setUpdateName(event.target.value)}
          onScoreChange={(event) => setUpdateScore(event.target.value)}
          onSubmit={handleUpdateTeacher}
        />
      )}

      { user?.role === "admin" && (
        <DeleteTeacherForm
          deleteId={deleteId}
          deleteMessage={deleteMessage}
          onIdChange={(event) => setDeleteId(event.target.value)}
          onSubmit={handleDeleteTeacher}
        />
      )}
    </div>
  )




}

export default App