import Navbar    from './components/ui/Navbar'
import Hero       from './components/sections/Hero'
import Learnify   from './components/sections/Learnify'
import Projects   from './components/sections/Projects'
import Automation from './components/sections/Automation'
import VoiceAgent from './components/sections/VoiceAgent'
import TechStack  from './components/sections/TechStack'
import About      from './components/sections/About'
import Contact    from './components/sections/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Learnify />
        <Projects />
        <Automation />
        <VoiceAgent />
        <TechStack />
        <About />
        <Contact />
      </main>
    </>
  )
}
