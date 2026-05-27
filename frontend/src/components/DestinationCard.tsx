import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faPenToSquare, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import type { Alias, Destination } from "../api/types"
import AliasList from "./AliasList"

type Props = {
  dest: Destination
  aliases: Alias[]
  onUpdate: (name: string, url: string) => void
  onDelete: () => void
  updatePending: boolean
}

export default function DestinationCard({ dest, aliases, onUpdate, onDelete, updatePending }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", url: "" })

  function startEdit() {
    setEditing(true)
    setForm({ name: dest.name, url: dest.url })
    setExpanded(true)
  }

  function handleSave() {
    onUpdate(form.name, form.url)
    setEditing(false)
    setExpanded(false)
  }

  return (
    <div className="collapse collapse-arrow border border-base-300 bg-base-200 shadow-sm">
      <input
        type="checkbox"
        checked={expanded}
        onChange={() => setExpanded(!expanded)}
      />

      <div className="collapse-title flex items-center gap-2 min-w-0 pe-12">
        <span className="font-semibold truncate">{dest.name}</span>
        <span className="text-base-content/40 select-none">&middot;</span>
        <a
          href={dest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-info truncate hover:underline z-10 relative"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {dest.url}
        </a>
        <span className="text-xs text-base-content/40 flex-shrink-0">
          ({aliases.length})
        </span>
        <div className="ml-auto flex gap-1 flex-shrink-0">
          <button
            className="btn btn-xs btn-ghost z-10 relative"
            onMouseDown={(e) => {
              e.stopPropagation()
              startEdit()
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="btn btn-xs btn-ghost text-error z-10 relative"
            onMouseDown={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>

      <div className="collapse-content">
        {editing && (
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              className="input input-sm input-bordered flex-1"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <input
              type="text"
              className="input input-sm input-bordered flex-1"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button
              className="btn btn-sm btn-ghost text-success"
              onClick={handleSave}
              disabled={updatePending}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button
              className="btn btn-sm btn-ghost text-error"
              onClick={() => setEditing(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        <AliasList destinationId={dest.id} aliases={aliases} />
      </div>
    </div>
  )
}
