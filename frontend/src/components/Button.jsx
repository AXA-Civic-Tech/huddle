import { NavLink } from "react-router-dom";

/**
 * @params name, onClick, to, type, ...props
 * "My Profile"
 * "Log Out"
 * "Sign Up"
 * "Log In"
 * @returns
 */

export default function Button({
  name,
  children,
  onClick,
  to,
  type = "button",
  ...props
}) {
  const ButtonElement = () => (
    <button onClick={onClick} type={type} {...props}>
      {name || children}
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
