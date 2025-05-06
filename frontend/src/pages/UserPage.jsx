import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { logUserOut } from "../adapters/auth-adapter";
import UpdateUsernameForm from "../components/UpdateUsernameForm";
import Feed from "../components/Feed";
import Button from "../components/Button";

/**
 * User can edit their username here
 * User can view their own posts and the posts they've upvoted
 * User can sort by favorited or their posts
 * TODO:
 * This sorting will be by most recent posts for either both their posts and upvoted
 * OR
 * Sorting favorited by the timestamp they were favorited
 * Feed will take care of fetching all the posts from the user and all the favorited posts if it's current user
 * Profile will take in user and based on the userId, pass it into Feed and it will fetch all the events related to the user.
 * "Create a New Post" might change to an icon
 * @returns
 */

export default function UserPage() {
  const navigate = useNavigate();
  const dialogRef = useRef();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { id } = useParams();

  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);

  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const [user, error] = await getUser(id);
      if (error) return setError(error);
      setUserProfile(user);
    };

    loadUser();
  }, [id]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleLogout = async () => {
    logUserOut();
    setCurrentUser(null);
    navigate("/");
  };

  if (error)
    return (
      <p>Sorry, there was a problem loading user. Please try again later.</p>
    );

  if (!userProfile) return null;

  // When we update the username, the userProfile state won't change but the currentUser state will.
  const profileUsername = isCurrentUserProfile
    ? currentUser.username
    : userProfile.username;

  return (
    <>
      <div className="profile-header">
        <h1>{profileUsername}</h1>
        {/* Need to figure this logic */}
        <Button name="Edit" />
        {isCurrentUserProfile && (
          <dialog
            className="update-username-form"
            ref={dialogRef}
            onClick={(e) => e.target == e.currentTarget && onClose()}
          >
            <UpdateUsernameForm
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </dialog>
        )}
        {isCurrentUserProfile && (
          <button onClick={handleLogout}>Log Out</button>
        )}

        <h3>
          {user.first_name} {user.last_name}
        </h3>

        <h3>{user.email}</h3>

        <Button name="View Map" to="/main" />
      </div>

      <div className="profile-feed">
        <Feed />
      </div>
    </>
  );
}
