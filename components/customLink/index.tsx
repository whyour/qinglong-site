import styles from "./index.module.scss";

export const CustomLink = ({ link, text }) => (
  <a
    href={link}
    className={`${styles.link} ${styles["inline-link"]}`}
    target="_blank"
  >
    {text}
  </a>
);
