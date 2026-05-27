import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDownWideShort, faArrowUpWideShort, faFont, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"

type Sort = "name" | "id-asc" | "id-desc"

type Props = {
  search: string
  onSearchChange: (v: string) => void
  sort: Sort
  onSortChange: (v: Sort) => void
}

const SORT_LABEL: Record<Sort, string> = { name: "Name", "id-asc": "Newest", "id-desc": "Oldest" }

export default function DestinationToolbar({ search, onSearchChange, sort, onSortChange }: Props) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl font-semibold flex-1">Destinations</h2>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-sm">
          <FontAwesomeIcon icon={faArrowDownWideShort} /> {SORT_LABEL[sort]}
        </div>
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-36 z-10">
          <li>
            <a onClick={() => onSortChange("name")}><FontAwesomeIcon icon={faFont} /> Name</a>
          </li>
          <li>
            <a onClick={() => onSortChange("id-asc")}><FontAwesomeIcon icon={faArrowDownWideShort} /> Newest</a>
          </li>
          <li>
            <a onClick={() => onSortChange("id-desc")}><FontAwesomeIcon icon={faArrowUpWideShort} /> Oldest</a>
          </li>
        </ul>
      </div>
      <label className="input input-sm input-bordered flex items-center gap-2 w-48">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-base-content/40" />
        <input
          type="text"
          placeholder="Search..."
          className="grow"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>
    </div>
  )
}
