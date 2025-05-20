import { useContext, useEffect, useState, useRef } from "react";
import { UserRoundPen } from "lucide-react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import UpdateUsernameForm from "../components/UpdateUsernameForm";
import Feed from "../components/Feed";

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
  const dialogRef = useRef();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { id } = useParams();

  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);

  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [postCount, setPostCount] = useState(0);

  // Add filter state
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  // Add filter change handler
  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value.includes(":")) {
      const [type, val] = value.split(":");
      setFilterType(type);
      setFilterValue(val);
    } else {
      setFilterType("all");
      setFilterValue("");
    }
  };

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

  const handlePostCountChange = (count) => {
    setPostCount(count);
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
    <div className="user-page-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-username-row">
            <h1>
              {profileUsername}{" "}
              {isCurrentUserProfile && (
                <>
                  <UserRoundPen
                    className="edit-profile-icon"
                    onClick={openModal}
                  />

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
                </>
              )}
            </h1>
          </div>

          <div className="profile-details-row">
            <span className="profile-realname">
              {userProfile.first_name} {userProfile.last_name}
            </span>
            <span className="profile-bio">{userProfile.email}</span>
            <span className="profile-posts-count">
              {postCount} Post{postCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
      <Feed
        onPostCountChange={handlePostCountChange}
        filterType={filterType}
        filterValue={filterValue}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
