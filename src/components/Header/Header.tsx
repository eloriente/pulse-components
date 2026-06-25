import React from 'react';
import { Button } from '../Button';
import styles from './Header.module.css';

type User = {
  name: string;
};

export interface HeaderProps {
  /** Currently logged-in user. When provided, shows welcome message and logout button. */
  user?: User;
  /** Called when the user clicks "Log in" */
  onLogin?: () => void;
  /** Called when the user clicks "Log out" */
  onLogout?: () => void;
  /** Called when the user clicks "Sign up" */
  onCreateAccount?: () => void;
  /**
   * Additional CSS classes to apply to the root element.
   * Use this to extend or override styles (e.g. with Tailwind utilities).
   */
  className?: string;
}

/** Site header with branding and authentication actions */
export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
  className,
}: HeaderProps) => (
  <header className={[styles.header, className].filter(Boolean).join(' ')}>
    <div className={styles.logo}>
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" fillRule="evenodd">
          <path
            d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z"
            fill="#FFF"
          />
          <path
            d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z"
            fill="#555AB9"
          />
          <path
            d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z"
            fill="#91BAF8"
          />
        </g>
      </svg>
      <h1 className={styles.title}>Acme</h1>
    </div>

    <div className={styles.actions}>
      {user ? (
        <>
          <span className={styles.welcome}>
            Welcome, <b>{user.name}</b>!
          </span>
          <Button size="small" onClick={onLogout} label="Log out" />
        </>
      ) : (
        <>
          <Button size="small" onClick={onLogin} label="Log in" />
          <Button primary size="small" onClick={onCreateAccount} label="Sign up" />
        </>
      )}
    </div>
  </header>
);
