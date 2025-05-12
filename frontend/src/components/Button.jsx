import { NavLink } from "react-router-dom";

/**
 * @param name, onClick, to, type, ...props
 * "My Profile"
 * "View Map"
 * "Log Out"
 * "Sign Up"
 * "Log In"
 * @returns
 */

export default function Button({
  name,
  onClick,
  to,
  type = "button",
  ...props
}) {
  const ButtonElement = () => (
    <button onClick={onClick} type={type} {...props}>
      {name}
    </button>
  );

  return to ? (
    <NavLink to={to}>
      <ButtonElement />
    </NavLink>
  ) : (
    <ButtonElement />
  );
}
