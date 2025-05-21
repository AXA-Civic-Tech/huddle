import { NavLink } from "react-router-dom";

/**
 * A versatile button component that can render either a regular HTML button
 * or a React Router `NavLink` wrapped button when a `to` prop is provided.
 *
 * @param {Object} props - Props for the Button component
 * @param {string} [props.name] - Text to display inside the button (optional if children provided)
 * @param {React.ReactNode} [props.children] - Alternative content to display inside the button
 * @param {function} [props.onClick] - Click handler function for the button
 * @param {string} [props.to] - Path to link to (if provided, button becomes a NavLink)
 * @param {string} [props.type="button"] - Button type attribute (e.g., "button", "submit")
 * @param {Object} [props.props] - Any additional props to spread onto the button element
 *
 * @returns {JSX.Element} A button element or a NavLink wrapping a button element
 */

export default function Button({
  name,
  children,
  onClick,
  to,
  type = "button",
  ...props
}) {
  /**
   * Inner button element
   * @returns {JSX.Element} A standard HTML button with applied props
   */
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
