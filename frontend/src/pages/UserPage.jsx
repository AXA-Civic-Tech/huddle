import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import { logUserOut } from "../adapters/auth-adapter";
import UpdateUsernameForm from "../components/UpdateUsernameForm";
import Feed from "../components/Feed";
import Button from "../components/Button";

/**
 * Current user can edit their username here
 * Current user can view their own posts and the posts they've upvoted
 * Current user can sort by favorited or their posts
 *
 * STRETCH: Turning UserPage into a reusable component
 * STRETCH: Current user can view other user's profile page that only have the user's posts
 *
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

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = (updatedUser) => {
    setIsOpen(false);
    if (updatedUser) setCurrentUser(updatedUser);
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
        <Button name="Edit" onClick={openModal} />
        {isCurrentUserProfile && (
          <dialog
            className="update-username-form"
            ref={dialogRef}
            onClick={(e) => {
              if (e.target == e.currentTarget) closeModal();
            }}
          >
            <UpdateUsernameForm
              currentUser={currentUser}
              setCurrentUser={(user) => {
                setCurrentUser(user);
                closeModal(user);
              }}
            />
          </dialog>
        )}

        {/* <h3>
          {user.first_name} {user.last_name}
        </h3>

        <h3>{user.email}</h3> */}
      </div>

      <div className="profile-feed">
        <Feed />
      </div>
    </>
  );
}
