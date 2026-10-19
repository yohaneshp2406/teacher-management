
import type { ChangeEvent, SubmitEvent } from "react"

type UpdateTeacherFormProps = {
  updateId: string
  updateName: string
  updateScore: string
  updateMessage: string
  onIdChange: (event: ChangeEvent<HTMLInputElement>) => void
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onScoreChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

function UpdateTeacherForm({
  updateId,
  updateName,
  updateScore,
  updateMessage,
  onIdChange,
  onNameChange,
  onScoreChange,
  onSubmit
}: UpdateTeacherFormProps) {
  return (
    <section>
      <h2>Update Teacher</h2>

      <form onSubmit={onSubmit}>
        <input
          type="number"
          placeholder="Teacher ID"
          value={updateId}
          onChange={onIdChange}
        />

        <input
          type="text"
          placeholder="New name"
          value={updateName}
          onChange={onNameChange}
        />

        <input
          type="number"
          placeholder="New score"
          value={updateScore}
          onChange={onScoreChange}
        />

        <button type="submit">
          Update Teacher
        </button>
      </form>

      <p>{updateMessage}</p>
    </section>
  )
}

export default UpdateTeacherForm
