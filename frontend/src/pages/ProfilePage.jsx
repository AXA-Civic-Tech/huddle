import Button from "../components/Button";
import SiteHeadingAndNav from "../components/SiteHeadingAndNav";
import UpdateUsernameForm from "../components/UpdateUsernameForm";

/**
 * User should be able to edit their username here
 * User should be able to view their own posts and the posts they've upvoted
 * User should be able to sort by favorited or their posts
 * This sorting will be by most recent posts for either both their posts and upvoted
 * OR
 * Sorting favorited by the timestamp they were favorited
 * Need a function somewhere where it fetch all the posts from the user and all the favorited posts if it's current user
 * @returns
 */

export default function ProfilePage({ user, events }) {
  // Need to clarify the events from the user
  // const userEvents = ;
  // Need to clarify the events the current user upvoted
  // const upvotedEvents = ;

  const isNew = !event?.id;
  const isEditableByUser =
    isNew || (currentUser && currentUser.id === event.user_id);
  const [isEdit, setIsEdit] = useState(isNew);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleEditMode = () => {
    setIsEdit(!isEdit);
  };

  return (
    <>
      <SiteHeadingAndNav />

      <div className="profile-header">
        <h1>@{user.username}</h1>
        <Button name="Edit" onClick={toggleEditMode} />
        {isEdit && <UpdateUsernameForm />}
        <h3>
          {user.first_name} {user.last_name}
        </h3>
        <h3>{user.email}</h3>

        <Button name="View Map" />
        <Button name="Report a New Issue" />
      </div>

      <div className="profile">
        {events.filter(
          (event) =>
            event.user_id === user.id && (
              <Post key={event.id} event={event} onSelect={setSelectedEvent} />
            )
        )}
        {selectedEvent && (
          <Modal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </>
  );
}
