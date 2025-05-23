import { Link } from "react-router-dom";

/**
 * Footer component for the website.
 *
 * Displays:
 * - Copyright with current year.
 * - GitHub link to AXA Civic Tech project.
 * - Attribution to project contributors with links to their GitHub, portfolio, and LinkedIn.
 *
 * This component is static and shared across all pages.
 *
 * @component
 * @returns {JSX.Element} The footer section of the site.
 */

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
              className="footer-icon"
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
              className="footer-icon"
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
              className="footer-icon"
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
              className="footer-icon"
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
              className="footer-icon"
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
              className="footer-icon"
            />
          </Link>
        </span>
      </p>
    </footer>
  );
}
