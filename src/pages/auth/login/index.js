import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import styles from '../styles/auth.module.css'
import { FcGoogle } from 'react-icons/fc'
import { BsGithub } from 'react-icons/bs'
import Layout from '@/components/layout'
import { useRouter } from 'next/router'
import { loginUser } from '@/lib/api/client/auth'
import Head from 'next/head'
import Link from 'next/link'

export default function Login({ loggedIn }) {
  // Input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { accessLoginStatus } = useAuth();
  const router = useRouter();
  const userRef = useRef(); // For setting focus on first input field

  // Scroll to top and focus email input
  useEffect(() => {
    window.scrollTo(0, 0);
    userRef.current.focus();

    // Get latest login status
    if (accessLoginStatus('update', null))
      router.push('/home');
  }, []);

  // Clear error message when input changes
  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  // Attempt login
  async function handleSubmit(e) {
    e.preventDefault();

    // Log user in
    const response = await loginUser({ email: email, password: password });

    // Handle error
    if (response.error)
      setErrorMessage(response?.error?.response?.data?.message);
    else {
      // Set login status to true go to home page
      accessLoginStatus('set', true);
      router.push('/home');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Log in to event tracker</title>
      </Head>
      <main className={`${styles['auth-page']} main`}>
        <form id="login-form" className={styles['auth-form']} autoComplete="off" onSubmit={handleSubmit}>
          <div className={styles['auth-title']}>
            <h1>Sign in</h1>
          </div>
          <div className={styles['input-group']}>
            <input
              type="text"
              id="email"
              ref={userRef}
              className={styles['auth-input']}
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className={styles['auth-label']}>Email</label>
          </div>
          <div className={styles['input-group']}>
            <input
              type="password"
              id="password"
              className={styles['auth-input']}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className={styles['auth-label']}>Password</label>
          </div>
          {/* If theres an error message, display it */}
          {errorMessage && <span>{errorMessage}</span>}
          <div className={styles['submit-container']}>
            <button className={styles['auth-submit']} form="login-form" disabled={(email && password) ? false : true}>Sign in</button>
          </div>
          <div className={styles['auth-footer']}>
            <span>Or</span>
            <div className={styles['submit-container']}>
              <FcGoogle className={styles['next-auth']} onClick={() => signIn("google")} />
              <BsGithub className={styles['next-auth']} />
            </div>
            <span>Don't have an account? <Link href="/auth/register">Sign Up</Link></span>
          </div>
        </form>
      </main>
    </Layout>
  )
}