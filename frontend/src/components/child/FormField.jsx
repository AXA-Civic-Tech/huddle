export default function FormField({
  name,
  label,
  type = "text",
  value,
  onChange,
  options,
  ...props
}) {
  const renderField = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    } else if (type === "select") {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options &&
            options.map((option, index) => {
              <option key={index} value={option.value}>
                {option.label}
              </option>;
            })}
        </select>
      );
    } else {
      return (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    }
  };
  return (
    <div className="field">
      <label htmlFor={name}>
        <strong>{label}:</strong>
      </label>

      {renderField()}
    </div>
  );
}
