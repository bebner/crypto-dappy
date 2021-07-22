import Spinner from "./Spinner"

export default function ErrorLoadingRenderer({ children, loading, error }) {
  if (loading) return <Spinner />
  if (error) {
    return "Error"
  }
  return children
}

