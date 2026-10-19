import type { ReactNode } from "react"

type User = {
  id: number
  name: string
  email: string
  role: string
}

type TeacherDashboardProps = {
  user: User
  children: ReactNode
}

function TeacherDashboard({
  user,
  children
}: TeacherDashboardProps) {
  return (
    <section>
      <h1>Teacher Dashboard</h1>

      <p>Welcome, {user.name}</p>
      <p>Role: {user.role}</p>

      <hr />

      {children}
    </section>
  )
}

export default TeacherDashboard