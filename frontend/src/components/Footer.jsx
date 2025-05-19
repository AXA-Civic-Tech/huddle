import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        {`Copyright © ${new Date().getFullYear()} `}
        <Link
          to="https://github.com/AXA-Civic-Tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          AXA
        </Link>
      </p>

      <p>All Rights Reserved</p>

      <p className="contributors">
        <span className="contributor">
          <Link
            to="https://github.com/autumnlydon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github-icon.png"
              alt="Autumn's GitHub"
              className="icon"
            />
          </Link>

          <Link
            to="https://autie.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Autumn Lydon
          </Link>

          <Link
            to="https://www.linkedin.com/in/autumnlydon/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/linkedin-icon.png"
              alt="Autumn's LinkedIn"
              className="icon"
            />
          </Link>
        </span>

        <span className="dot"> • </span>

        <span className="contributor">
          <Link
            to="https://github.com/Nakuziri"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github-icon.png"
              alt="Xavier's GitHub"
              className="icon"
            />
          </Link>
          Xavier Campos
          <Link
            to="https://www.linkedin.com/in/xavier-campos-97b6b3268/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/linkedin-icon.png"
              alt="Xavier's LinkedIn"
              className="icon"
            />
          </Link>
        </span>

        <span className="dot"> • </span>

        <span className="contributor">
          <Link
            to="https://github.com/AthenaC"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github-icon.png"
              alt="Athena's GitHub"
              className="icon"
            />
          </Link>

          <Link
            to="https://athenac.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Athena Chang
          </Link>

          <Link
            to="https://www.linkedin.com/in/athena-chang/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/linkedin-icon.png"
              alt="Athena's LinkedIn"
              className="icon"
            />
          </Link>
        </span>
      </p>
    </footer>
  );
}
