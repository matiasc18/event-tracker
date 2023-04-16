import styles from './styles/events-control.module.scss'

// Display event grid control options
export default function EventControl({ title }) {
  return (
    <div className={styles['events-control']}>
      <h1>{title}</h1>
      <div className={styles['button-container']}>
        <button>Sort</button>
        <button>Filter</button>
      </div>
    </div>
  )
}