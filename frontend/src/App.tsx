import "./App.css"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast, { Toaster } from "react-hot-toast"
import { api } from "./api"
import AddDestinationCard from "./components/AddDestinationCard"
import DestinationToolbar from "./components/DestinationToolbar"
import DestinationCard from "./components/DestinationCard"

export default function App() {
  const queryClient = useQueryClient()

  const {
    data: destinations = [],
    isLoading: destsLoading,
    isError: destsError,
  } = useQuery({
    queryKey: ["destinations"],
    queryFn: api.listDestinations,
  })

  const {
    data: aliases = [],
  } = useQuery({
    queryKey: ["aliases"],
    queryFn: api.listAliases,
  })

  const createDestMutation = useMutation({
    mutationFn: api.createDestination,
    onSuccess: (dest) => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] })
      setName("")
      setUrl("")
      toast.success("Destination created")

      const alias = dest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      api.createAlias({ name: alias, destination_id: dest.id }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["aliases"] })
      }).catch((err: Error) => {
        toast.error(`Default alias: ${err.message}`)
      })
    },
    onError: (err) => toast.error(err.message),
  })

  const updateDestMutation = useMutation({
    mutationFn: ({ id, name, url }: { id: number; name: string; url: string }) =>
      api.updateDestination(id, { name, url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] })
      toast.success("Destination updated")
    },
    onError: (err) => toast.error(err.message),
  })

  const deleteDestMutation = useMutation({
    mutationFn: api.deleteDestination,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] })
      queryClient.invalidateQueries({ queryKey: ["aliases"] })
      toast.success("Destination deleted")
    },
    onError: (err) => toast.error(err.message),
  })

  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"name" | "id-asc" | "id-desc">("id-asc")

  function handleCreateDest() {
    if (!name.trim() || !url.trim() || createDestMutation.isPending) return
    createDestMutation.mutate({ name, url })
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6 pt-[9vh] md:pt-[11vh]">
      <Toaster />

      <AddDestinationCard
        name={name}
        url={url}
        onNameChange={setName}
        onUrlChange={setUrl}
        onSubmit={handleCreateDest}
        isPending={createDestMutation.isPending}
        error={createDestMutation.error}
      />

      {destsLoading && <span className="loading loading-spinner" />}
      {destsError && <p className="text-error">Failed to load destinations.</p>}

      <DestinationToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="space-y-3">
        {destinations
          .filter((dest) => {
            if (!search.trim()) return true
            const q = search.toLowerCase()
            if (dest.name.toLowerCase().includes(q)) return true
            return aliases
              .filter((a) => a.destination_id === dest.id)
              .some((a) => a.name.toLowerCase().includes(q))
          })
          .sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name)
            if (sort === "id-desc") return a.id - b.id
            return b.id - a.id
          })
          .map((dest) => (
            <DestinationCard
              key={dest.id}
              dest={dest}
              aliases={aliases.filter((a) => a.destination_id === dest.id)}
              updatePending={updateDestMutation.isPending}
              onUpdate={(name, url) => updateDestMutation.mutate({ id: dest.id, name, url })}
              onDelete={() => deleteDestMutation.mutate(dest.id)}
            />
          ))}
      </div>
    </div>
  )
}
