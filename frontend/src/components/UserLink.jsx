import { Link } from "react-router-dom";

export default function UserLink({ userId, username }) {
  return <Link to={`/users/${userId}`}>{username}</Link>;
}
