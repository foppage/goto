import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

type Props = {
  name: string
  url: string
  onNameChange: (v: string) => void
  onUrlChange: (v: string) => void
  onSubmit: () => void
  isPending: boolean
  error?: Error | null
}

export default function AddDestinationCard({ name, url, onNameChange, onUrlChange, onSubmit, isPending, error }: Props) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Add Destination</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered flex-1"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <input
            type="text"
            placeholder="URL"
            className="input input-bordered flex-1"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!name.trim() || !url.trim() || isPending}
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>
        {error && (
          <p className="text-error text-sm">{error.message}</p>
        )}
      </div>
    </div>
  )
}
