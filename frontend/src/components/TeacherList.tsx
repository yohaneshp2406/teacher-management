type Teacher = {
  id: number
  name: string
  score: number
}

type TeacherListProps = {
  teachers: Teacher[]
}

function TeacherList({ teachers }: TeacherListProps) {
  return (
    <>
      <h2>Teachers</h2>

      {teachers.map((teacher) => (
        <div key={teacher.id}>
          {teacher.name} - {teacher.score}
        </div>
      ))}
    </>
  )
}

export default TeacherList