import { PASS_REGEX, EMAIL_REGEX } from '@/utils/utils'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../styles/auth.module.scss'
import { registerUser } from '@/lib/api/client/auth'
import { useRouter } from 'next/router'
import Select from 'react-select'
import { customStyles } from '@/utils/utils'
import Head from 'next/head'
import Link from 'next/link'
import { getUniversities } from '@/lib/api/client/unversities'

export default function Register({ universities }) {
  const router = useRouter();
  const { loginStatus, updateLoginStatus } = useAuth();

  // Input state
  const [university, setUniversity] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Unsuccessful login message
  
  // For setting focus on first input
  const firstNameRef = useRef();
  const [focus, setFocus] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [role, setRole] = useState(false);

  // Scroll to top and set focus on firstName input
  useEffect(() => {
    window.scrollTo(0, 0);
    firstNameRef.current.focus();

    // Get latest login status
    if (loginStatus)
      router.push('/home');

    setShowSelect(true);
  }, []);

  // Clear error message when input changes
  useEffect(() => {
    setErrorMessage('');
  }, [email, password, confirmPassword]);

  // Attempt signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!EMAIL_REGEX.test(email))
      setErrorMessage('Invalid email');
    else if (!PASS_REGEX.test(password))
      setErrorMessage('Invalid password');
    else if (password !== confirmPassword)
      setErrorMessage('Passwords do not match');
    else {
      if (role.value === true) {
        await registerUser({
          univId: null,
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          role: 'superadmin'
        });
        // Set login status to true and go to home page
        updateLoginStatus(true);
        router.push('/auth/university/create');
      }
      else {
        // Register user in db
        await registerUser({
          univId: university.value,
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          role: 'student'
        });
        // Set login status to true and go to home page
        updateLoginStatus(true);
        router.push('/home');
      }
    }
  };

  return (
    <>
      <Head>
        <title>Log in to event tracker</title>
      </Head>
      <main className={`${styles['auth-page']} main`}>
        <form id="signup-form" className={styles['auth-form']} autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
          <section className={`${styles['register-container']}`}>
            <div className={styles['auth-title']}>
              <h1>Register</h1>
            </div>
            {showSelect && <div className={styles['input-group']}>
              <Select
                styles={customStyles}
                value={role}
                options={[{ value: true, label: 'Superadmin' }, { value: false, label: 'Student' }]}
                onChange={(selection) => setRole(selection)}
                placeholder="Select role..." />
            </div>}
            {showSelect && <div className={`${styles['input-group']} ${role.value === true ? 'disabled' : ''}`}>
              <Select
                styles={customStyles}
                value={university}
                options={universities}
                onChange={(selection) => setUniversity(selection)}
                isSearchable={true}
                placeholder="Select university..." />
            </div>}
            <hr />
            <div className={styles['double-input']}>
              <div className={`${styles['input-group']}`}>
                <input
                  type="text"
                  id="first-name"
                  ref={firstNameRef}
                  className={styles['auth-input']}
                  placeholder="First name"
                  autoComplete="on"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor="first-name" className={styles['auth-label']}>First name</label>
              </div>
              <div className={`${styles['input-group']}`}>
                <input
                  type="text"
                  id="last-name"
                  className={styles['auth-input']}
                  placeholder="Last name"
                  autoComplete="on"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="last-name" className={styles['auth-label']}>Last name</label>
              </div>
            </div>
            <div className={`${styles['input-group']}`}>
              <input
                type="email"
                id="email"
                className={styles['auth-input']}
                placeholder="Email"
                autoComplete="on"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className={styles['auth-label']}>Email</label>
            </div>
            <div className={`${styles['input-group']}`}>
              <input
                type="password"
                id="password"
                className={styles['auth-input']}
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocus('password')}
                onBlur={() => setFocus(null)}
              />
              <label htmlFor="password" className={styles['auth-label']}>Password</label>
              {/* Display password requirements until valid password typed */}
              {focus === 'password' && !PASS_REGEX.test(password) &&
                <ul className={styles['input-instructions']}>
                  <li>8 to 24 characters</li>
                  <li>Must contain upper and lowercase letters</li>
                  <li>Must contain at least one number</li>
                  <li>Must contain at least one special character (!@#$%)</li>
                </ul>
              }
            </div>
            <div className={`${styles['input-group']}`}>
              <input
                type="password"
                id="confirmPassword"
                className={styles['auth-input']}
                placeholder="Confirm Password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="confirmPassword" className={styles['auth-label']}>Confirm Password</label>
            </div>
            <div className={styles['submit-container']}>
              <button className={styles['auth-submit']} form="signup-form" disabled={(email && password) ? false : true}>Sign in</button>
            </div>
            <span>Already have an account? <Link href="/auth/login">Sign in</Link></span>
            <span>New superadmin? <Link href="/auth/university/create">Create a University</Link></span>
            {/* If theres an error message, display it */}
            {errorMessage && <span className={styles['error-message']}>{errorMessage}</span>}
          </section>
        </form>
      </main>
    </>
  )
};

export async function getServerSideProps() {
  const { universities } = await getUniversities();
  const options = universities.map((univ) => {
    return { value: univ.univ_id, label: univ.name };
  });

  return {
    props: {
      universities: options
    }
  }
}