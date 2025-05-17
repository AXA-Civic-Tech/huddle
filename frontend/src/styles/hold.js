// index.css:
/*

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
  font-family: "Cal Sans", sans-serif;
}

body {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  background: transparent;
}

main {
  /* padding: 1rem; */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
}

ul {
  list-style: none;
}

button {
  padding-inline: 0.25rem;
  cursor: pointer;
}

input,
label {
  display: block;
}

input {
  margin-bottom: 1rem;
}

.footer {
  text-align: center;
  padding: 1.5rem 1rem;
  background-color: #f9f9f9;
  color: #333;
  font-size: 0.9rem;
}

.footer p {
  margin: 0.5rem 0;
}

.contributors {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.contributor {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.dot {
  margin: 0 0.5rem;
  color: #888;
}

.footer a {
  color: #0077cc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #004d99;
}

/* Dim and blur homepage when modal open */
.disabled-blur {
  filter: blur(4px);
  pointer-events: none; /* disables interactions */
  user-select: none;
  opacity: 0.6;
}

/* Overlay fills screen, glassmorphic style */
.glassmorphic-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal content container */
.modal-content {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
  max-width: 900px;
  width: 90%;
  display: flex;
  gap: 2rem;
  color: #111;
}

/* Reuse glassmorphic style for info-section and form-wrapper */
.login-signup-container .info-section,
.login-signup-container .form-wrapper {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* You can add responsive and layout styling as needed */
.login-signup-container {
  display: flex;
  gap: 2rem;
}

*/





modal.css:
/* Modal styling */
.modal {
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  padding: 0;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background-color: white;
  /* Center the modal */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /* Glassmorphism background */
  /* background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15); */
}

.modal-bg {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999; /* even higher than 998 just to be safe */
}

.modal::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  max-height: 90vh;
}

/* Layout for event display with image on left */
.modal-display {
  display: flex;
  flex-direction: row;
  gap: 20px;
  /* Make this container take available space but allow for comments */
  flex: 1;
  overflow: hidden;
}

/* Images container */
.event-images {
  flex: 0 0 40%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 200px;
  max-height: 300px;
  background-color: #f0f0f0;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #888;
}

.event-image {
  width: 100%;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
  max-height: 300px;
}

.event-image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

/* Content container */
.event-content {
  flex: 1;
  overflow-y: auto; /* Make this section scrollable if needed */
  padding-right: 10px; /* Space for scrollbar */
}

.event-view {
  margin-bottom: 20px;
}

.event-title {
  font-size: 24px;
  margin-top: 0;
  color: #333;
}

.created-by {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

/* Field styling */
.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  margin-bottom: 5px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.field textarea {
  min-height: 100px;
  resize: vertical;
}

.display-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.display-field strong {
  color: #555;
  font-size: 14px;
}

.field-value {
  font-size: 16px;
  margin-top: 2px;
}

.description-section {
  margin-top: 16px;
}

.description-section h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.description-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

.location-details,
.contact-info {
  margin: 12px 0;
  padding: 10px 0;
}

.display-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.display-field strong {
  color: #555;
  font-size: 14px;
}

.field-value {
  font-size: 16px;
  margin-top: 2px;
}

.description-section {
  margin-top: 16px;
}

.description-section h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #555;
}

.description-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

.location-details,
.contact-info {
  margin: 12px 0;
  padding: 10px 0;
  resize: vertical;
}

/* Image upload button for new posts */
.image-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  background-color: #f9f9f9;
  min-height: 150px;
  text-align: center;
  transition: all 0.2s ease;
}

.image-upload:hover {
  background-color: #f0f0f0;
  border-color: #aaa;
}

.image-preview {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.image-preview img {
  max-width: 100%;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  object-fit: contain;
}

/* Comments section */
.comments {
  margin-top: 24px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  /* Fixed height for comments section */
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.comments h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.comment-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.comments-list {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  /* Makes comments section scrollable */
  overflow-y: auto;
}

.comment {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  line-height: 1.4;
}

.comment:last-child {
  border-bottom: none;
}

/* Upvotes section */
.upvotes {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  padding: 8px 0;
}

.upvotes span {
  font-weight: 500;
}

/* Buttons container */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Button styling */
button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #3498db;
  color: white;
}

button:hover {
  background-color: #2980b9;
}

button[name="Cancel"],
button[name="Close"] {
  background-color: #f1f1f1;
  color: #333;
}

button[name="Cancel"]:hover,
button[name="Close"]:hover {
  background-color: #e0e0e0;
}

button[name="Delete Post"] {
  background-color: #e74c3c;
}

button[name="Delete Post"]:hover {
  background-color: #c0392b;
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-display {
    flex-direction: column;
  }

  .event-images {
    flex: none;
    width: 100%;
    max-height: 250px;
  }

  .modal-actions {
    flex-direction: column;
  }

  button {
    width: 100%;
  }

  .comment-input {
    flex-direction: column;
  }
}

/* For even smaller screens */
@media (max-width: 480px) {
  .modal {
    width: 95%;
  }

  .modal-content {
    padding: 15px;
  }
}





login-signup.css:
form {
  padding: 1rem;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

form > h1 {
  margin-bottom: 0.75rem;
}

/* Container holding both sections */
.login-signup-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: Arial, sans-serif;
}

/* Left Side - Info Section */
.info-section {
  width: 50%;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #333;
}

.app-title {
  font-size: 3rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #475569;
}

.section-label {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.mission-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 2rem;
  max-width: 500px;
}

/* Right Side - Form Section */
.switch-form-prompt {
  text-align: center;
  margin-top: 2rem;
}

.switch-form-button {
  margin-top: 0.5rem;
  background-color: #1e3a8a;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.switch-form-button:hover {
  background-color: #374151;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Style for first and last name side-by-side */
.name-inputs {
  display: flex;
  justify-content: space-between;
}

.name-inputs input {
  flex: 1;
}

.first-name input,
.last-name input {
  width: 8.5rem;
}
