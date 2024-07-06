import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">
            <button className={styles.navLink}>Home</button>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/about">
            <button className={styles.navLink}>About</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
