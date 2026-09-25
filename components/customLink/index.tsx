import styles from "./index.module.scss";

interface CustomLinkProps {
  link: string;
  text: string;
}

export const CustomLink = ({ link, text }: CustomLinkProps) => (
  <a
    href={link}
    className={`${styles.link} ${styles["inline-link"]}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {text}
  </a>
);
