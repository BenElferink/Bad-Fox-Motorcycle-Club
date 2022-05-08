import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'

export default function Redirect() {
  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <Section>Coming Soon..!</Section>
      </Landing>
      <Footer />
    </div>
  )
}
