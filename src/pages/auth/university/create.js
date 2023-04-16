import { createUniversity } from '@/lib/api/client/unversities'
import { createLocation } from '@/lib/api/client/locations'
import styles from './styles/superadmin.module.scss'
import { getAuthToken, getRole } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Map from '@/components/map'
import Head from 'next/head'

// Initial center set to UCF
const initialCenter = { lat: 28.6024, lng: -81.2001 };

export default function Create({ role }) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [population, setPopulation] = useState(0);
  const [coordinates, setCoordinates] = useState(initialCenter);
  const [locationUrl, setLocationUrl] = useState('');
  const [locationId, setLocationId] = useState('');
  const [locationName, setLocationName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  // Redirect user if they are not a superadmin
  useEffect(() => {
    // if (role !== 'superadmin')
    //   router.push('/home');
  }, []);

  // Reset error message when user changes input
  useEffect(() => {
    setErrorMessage('');
  }, [name, locationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const location = {
      locationId,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      locationName,
      locationUrl
    };

    // Create university's location
    const locationRes = await createLocation(location);

    // If there are no errors, or the location already exists in the database
    if (locationRes.status === 200 || locationRes.status === 409) {
      const univ = {
        locationId,
        name,
        abbreviation,
        population,
        description
      };

      // Get user's token and create university using new location
      const authToken = getAuthToken();
      const univRes = await createUniversity(univ, authToken);

      // University created successfully
      if (univRes.status === 200) {
        router.push('/home');
      }
      else {
        if (univRes?.data?.message)
          setErrorMessage(univRes.data.message);
      }
    }
    else if (locationRes.status >= 400) {
      if (locationRes?.data?.message)
        setErrorMessage(locationRes.data.message);
    }
  };

  return (
    <>
      <Head>
        <title>Create a University</title>
      </Head>
      <main className={`${styles['auth-page']} main`}>
        <form id="university-form" className={styles['auth-form']} autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
          <div className={styles['auth-title']}>
            <h1>Create A University</h1>
          </div>
          <div className={styles['superadmin-container']}>
            <section className={styles['superadmin-left']}>
              <Map
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                setLocationUrl={setLocationUrl}
                setLocationId={setLocationId}
                setLocationName={setLocationName}
                initialCenter={initialCenter}
                setName={setName}
              />
            </section>
            <section className={styles['superadmin-right']}>
              <div className={styles['input-group']}>
                <input
                  type="text"
                  id="university-name"
                  className={styles['auth-input']}
                  placeholder="University name"
                  autoComplete="on"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="university-name" className={styles['auth-label']}>University Name</label>
              </div>
              <div className={styles['input-group']}>
                <input
                  type="text"
                  id="university-abbreviation"
                  className={styles['auth-input']}
                  placeholder="Abbreviation"
                  autoComplete="on"
                  required
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                />
                <label htmlFor="university-abbreviation" className={styles['auth-label']}>Abbreviation</label>
              </div>
              <div className={`${styles['input-group']} ${coordinates && locationId && locationName}`}>
                <input
                  type="text"
                  id="location-name"
                  className={styles['auth-input']}
                  placeholder="University name"
                  autoComplete="on"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
                <label htmlFor="location-name" className={styles['auth-label']}>Location name</label>
              </div>
              <div className={styles['input-group']}>
                <input
                  type="number"
                  id="university-population"
                  className={styles['auth-input']}
                  placeholder="Population"
                  required
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                />
                <label htmlFor="university-population" className={styles['auth-label']}>Population</label>
              </div>
              <div className={`${styles['input-group']} ${styles['description-input']}`}>
                <textarea
                  id="university-description"
                  className={styles['auth-input']}
                  placeholder="Add a description..."
                  required
                  onChange={(e) => setDescription(e.target.value)}
                >
                </textarea>
              </div>
            </section>
          </div>
          <div className={styles['submit-container']}>
            <button className={styles['auth-submit']} form="university-form" disabled={(name && population && description) ? false : true}>Create</button>
          </div>
          {/* If theres an error message, display it */}
          {errorMessage && <span className="error-message">{errorMessage}</span>}
        </form>
      </main >
    </>
  )
};

export async function getServerSideProps(context) {
  const role = await getRole(context);

  return {
    props: {
      role: role
    }
  }
}