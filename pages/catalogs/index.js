import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import ProjectListItem from '../../components/ProjectListItem'
import projectsFile from '../../data/projects.json'

export default function Page() {
  const router = useRouter()
  const { isMobile, screenHeight } = useScreenSize()

  const styles = {
    sectionTile: {
      margin: '0 0 1rem 0',
    },
    projectsWrapper: {
      maxWidth: '45vw',
      flexWrap: 'wrap',
    },
    divider: {
      width: 2,
      height: screenHeight / 3,
      margin: isMobile ? '0 1rem' : '0 3rem',
      backgroundColor: 'var(--orange)',
      borderRadius: '1rem',
    },
  }

  return (
    <div className='App flex-col'>
      <Header />
      <div className='flex-row' style={{ minHeight: '50vh' }}>
        <section className='flex-col'>
          <h3>Collections</h3>
          <div className='flex-row' style={styles.projectsWrapper}>
            {projectsFile.map((proj) =>
              proj.catalogCollections ? (
                <ProjectListItem
                  key={`collections-${proj.policyId}`}
                  name={proj.name}
                  image={proj.image}
                  onClick={() => router.push(`/catalogs/collections/${proj.policyId}`)}
                />
              ) : null
            )}
          </div>
        </section>

        <div style={styles.divider} />

        <section className='flex-col'>
          <h3>Traits</h3>
          <div className='flex-row' style={styles.projectsWrapper}>
            {projectsFile.map((proj) =>
              proj.catalogTraits ? (
                <ProjectListItem
                  key={`traits-${proj.name}`}
                  name={proj.name}
                  image={proj.image}
                  onClick={() => router.push(`/catalogs/traits/${proj.policyId}`)}
                />
              ) : null
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
