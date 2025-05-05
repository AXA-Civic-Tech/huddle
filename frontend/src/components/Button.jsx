import { NavLink } from "react-router-dom";

export default function Button({
  name,
  onClick,
  to,
  type = "button",
  ...props
}) {
  const btn = () => {
    <button onClick={onClick} type="type" {...props}>
      {name}
    </button>;
  };

  return to ? <NavLink to={to}>{btn}</NavLink> : btn;
}
