import { useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";

export default function Post() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  return (
    <div className="post">
      <img src="" alt="" />

      <h2>Title</h2>

      <label>Status:</label>
      {!currentUser ? (
        status
      ) : (
        <select>
          <option>Open</option>
          <option>In Progress...</option>
          <option>Closed</option>
        </select>
      )}

      <div className="comments"></div>
    </div>
  );
}
