import './App.css'
import Navbar  from './components/Navbar';
import { Cardcontainer } from './components/cardContaier';
import { Searchbar } from './components/SearchBar'

function App() {


  return (
    <div >
      <Navbar/>
      <Searchbar/>
      <Cardcontainer/>
    </div>
  )
}

export default App