import { FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <small>
        &copy; {new Date().getFullYear()} made by -{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://granada.com.gt/es/"
        >
          TechKu
        </a>
      </small>
    </footer>
  );
}

export default Footer;
