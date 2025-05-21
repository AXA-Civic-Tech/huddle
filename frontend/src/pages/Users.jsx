import { useEffect, useState } from "react";
import { getAllUsers } from "../adapters/user-adapter";
import UserLink from "../components/UserLink";

/**
 * UsersPage component fetches and displays a list of all users.
 *
 * Fetches user data on mount via the getAllUsers API adapter.
 * Handles loading errors and displays an error message if fetching fails.
 * Renders a list of UserLink components for each user.
 *
 * @returns {JSX.Element} A page displaying a list of users or an error message.
 */

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  /**
   * useEffect hook that runs once on component mount.
   * Loads all users asynchronously from the API and updates state.
   * Handles and sets error state if fetching fails.
   */
  useEffect(() => {
    const loadUsers = async () => {
      const [data, error] = await getAllUsers();
      if (error) setError(error);
      else if (data) setUsers(data);
    };
    loadUsers();
  }, []);

  if (error)
    return (
      <p>Sorry, there was a problem loading users. Please try again later.</p>
    );

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <UserLink user={user} />
          </li>
        ))}
      </ul>
    </>
  );
}
