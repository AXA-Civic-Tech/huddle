/**
 * This component is for rendering limited amount of data for the Feed
 * Post has event listener if user click on the card
 * @returns
 */

import Button from "./Button";

export default function Post({ event, onSelect }) {
  const handleClick = () => {
    if (onSelect) onSelect(event);
  };

  return (
    <div className="post" onClick={handleClick}>
      {/* <img src={event.image.src} alt={event.image.alt} /> */}

      <h2 className="title">{event.title}</h2>


      {/* <p className="status">Status: {event.status}</p> */}

      <Button name="View More" onClick={handleClick} />

      {/* <div className="comments">{event.comments[0]}</div> */}
    </div>
  );
}
