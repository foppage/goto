import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faPenToSquare, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons"
import toast from "react-hot-toast"
import { api } from "../api"
import type { Alias } from "../api/types"

type Props = {
  destinationId: number
  aliases: Alias[]
}

export default function AliasList({ destinationId, aliases }: Props) {
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const createMutation = useMutation({
    mutationFn: () => api.createAlias({ name: newName, destination_id: destinationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aliases"] })
      setNewName("")
      toast.success("Alias added")
    },
    onError: (err) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      api.updateAlias(id, { name, destination_id: destinationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aliases"] })
      setEditingId(null)
      toast.success("Alias updated")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteAlias(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aliases"] })
      toast.success("Alias deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  function handleAdd() {
    if (!newName.trim() || createMutation.isPending) return
    createMutation.mutate()
  }

  return (
    <div>
      <div className="divider my-2" />
      {aliases.length === 0 && (
        <p className="text-base-content/50 text-sm mb-3">No aliases yet.</p>
      )}
      <ul className="space-y-2 mb-4">
        {aliases.map((alias) => (
          <li key={alias.id} className="flex items-center gap-2">
            {editingId === alias.id ? (
              <>
                <input
                  type="text"
                  className="input input-sm flex-1"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateMutation.mutate({ id: alias.id, name: editName })
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  autoFocus
                />
                <button
                  className="btn btn-sm btn-ghost text-success"
                  onClick={() => updateMutation.mutate({ id: alias.id, name: editName })}
                  disabled={updateMutation.isPending}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button
                  className="btn btn-sm btn-ghost text-error"
                  onClick={() => setEditingId(null)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm">{alias.name}</span>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => {
                    setEditingId(alias.id)
                    setEditName(alias.name)
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="btn btn-xs btn-ghost text-error"
                  onClick={() => deleteMutation.mutate(alias.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New alias"
          className="input input-sm flex-1"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAdd}
          disabled={!newName.trim() || createMutation.isPending}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  )
}
