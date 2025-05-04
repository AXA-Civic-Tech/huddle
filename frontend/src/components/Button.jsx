import { NavLink } from "react-router-dom";

export default function Button({ name, onClick, to }) {
  if (to) {
    return (
      <NavLink to={to}>
        <button onClick={onClick}>{name}</button>
      </NavLink>
    );
  }
  return <button onClick={onClick}>{name}</button>;
}
