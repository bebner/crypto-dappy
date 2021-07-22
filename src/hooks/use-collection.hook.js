import { useState } from 'react'

export default function useCollection() {
  const [loading] = useState(true)
  const [collection, setCollection] = useState(false)

  const createCollection = async () => {
    setCollection(true)
  }

  const deleteCollection = async () => {
    setCollection(false)
    window.location.reload()
  }

  return {
    loading,
    collection,
    createCollection,
    deleteCollection
  }
}
