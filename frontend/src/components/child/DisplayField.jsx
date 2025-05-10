export default function DisplayField({ label, value }) {
  return (
    <div className="field">
      <strong>{label}:</strong>
      <p>{value}</p>
    </div>
  );
}
