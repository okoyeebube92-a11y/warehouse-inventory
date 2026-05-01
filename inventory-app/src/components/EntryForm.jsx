import { useEntries } from "../hooks/useEntries";

export default function EntryForm() {
  const { addEntries, loading, error } = useEntries();

  const handleSubmit = async () => {
    await addEntries([
      {
        model: "RD 8000 BT",
        qty: 10,
        unit: "pcs",
        date: "2026-04-30"
      }
    ]);
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}