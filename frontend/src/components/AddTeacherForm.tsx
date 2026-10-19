import type { ChangeEvent, SubmitEvent } from "react"

type AddTeacherFormProps = {
  teacherForm: {
    name: string
    score: string
  }
  teacherMessage: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

function AddTeacherForm({
  teacherForm,
  teacherMessage,
  onChange,
  onSubmit
}: AddTeacherFormProps) {
  return (
    <section>
      <h2>Add Teacher</h2>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Teacher name"
          value={teacherForm.name}
          onChange={onChange}
        />

        <input
          type="number"
          name="score"
          placeholder="Score"
          value={teacherForm.score}
          onChange={onChange}
        />

        <button type="submit">
          Add Teacher
        </button>
      </form>

      <p>{teacherMessage}</p>
    </section>
  )
}

export default AddTeacherForm