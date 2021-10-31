//import { server } from '../config'
import Head from 'next/head'
import SensorTable from '../components/SensorTable'
import styles from '../styles/Layout.module.css'

export default function Home({data}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Sensor Data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Sensor Data
        </h1>

        <SensorTable data={data} />
        
      </main>

      <footer className={styles.footer}>

          Using Next.js

      </footer>
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch('http://localhost:4000/api/report_aggregate')
  const data = await res.json()
  return {
    props:{
      data
    }
  }
}


/*
getStaticProps - at build time
getServerSideProps - fetch on every request (slower)
getStaticPaths 
*/
