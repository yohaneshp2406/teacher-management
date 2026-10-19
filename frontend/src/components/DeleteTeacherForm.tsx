
import type { ChangeEvent, SubmitEvent } from "react"

type DeleteTeacherFormProps = {
  deleteId: string
  deleteMessage: string
  onIdChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void
}

function DeleteTeacherForm({
  deleteId,
  deleteMessage,
  onIdChange,
  onSubmit
}: DeleteTeacherFormProps) {
  return (
    <section>
      <h2>Delete Teacher</h2>

      <form onSubmit={onSubmit}>
        <input
          type="number"
          placeholder="Teacher ID"
          value={deleteId}
          onChange={onIdChange}
        />

        <button type="submit">
          Delete Teacher
        </button>
      </form>

      <p>{deleteMessage}</p>
    </section>
  )
}

export default DeleteTeacherForm
