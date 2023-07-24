import { FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <small>
        &copy; {new Date().getFullYear()} dibuat oleh -{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ternaklele.techkudev.com"
        >
          KKN UAJY 83
        </a>
      </small>
    </footer>
  );
}

export default Footer;
