import { useContext, useEffect, useState, useRef } from "react";
import { UserRoundPen } from "lucide-react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import { getUser } from "../adapters/user-adapter";
import UpdateUsernameForm from "../components/UpdateUsernameForm";
import Feed from "../components/Feed";

/**
 * UserPage component displays a user's profile page.
 *
 * Features include:
 * - Current user can edit their username via a modal form.
 * - Displays user's posts and allows filtering posts by type or value.
 * - Shows user's basic info and post count.
 * - Supports viewing own profile or other users' profiles.
 *
 * @returns {JSX.Element|null} User profile page or null if loading
 */

export default function UserPage() {
  const dialogRef = useRef();
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { id } = useParams();

  // Check if viewing own profile based on currentUser id and URL param
  const isCurrentUserProfile = currentUser && currentUser.id === Number(id);

  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [postCount, setPostCount] = useState(0);

  // Filters for posts
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  /**
   * Handler for changing filter criteria based on user selection.
   * Parses input string of format "type:value" to update filterType and filterValue.
   * If format is invalid, resets filter to 'all'.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - The filter change event
   */
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

  /**
   * useEffect hook to fetch user profile data when the 'id' parameter changes.
   * Calls async getUser API adapter, sets userProfile or error state accordingly.
   */
  useEffect(() => {
    const loadUser = async () => {
      const [user, error] = await getUser(id);
      if (error) return setError(error);
      setUserProfile(user);
    };

    loadUser();
  }, [id]);

  /**
   * useEffect hook to control dialog modal visibility based on 'isOpen' state.
   * Opens modal when isOpen becomes true, closes modal when false.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog?.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Opens the update username modal dialog.
  const openModal = () => {
    setIsOpen(true);
  };

  /**
   * Closes the modal dialog.
   * If an updated user is provided, updates the currentUser context.
   *
   * @param {Object} [updatedUser] - Optional updated user object to update context
   */
  const closeModal = (updatedUser) => {
    setIsOpen(false);
    if (updatedUser) setCurrentUser(updatedUser);
  };

  /**
   * Updates the post count state when the Feed component reports a new post count.
   *
   * @param {number} count - The new post count
   */
  const handlePostCountChange = (count) => {
    setPostCount(count);
  };

  if (error)
    return (
      <p>Sorry, there was a problem loading user. Please try again later.</p>
    );

  if (!userProfile) return null;

  // Determine username to show, using currentUser username if viewing own profile,
  // otherwise use username from fetched userProfile
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
