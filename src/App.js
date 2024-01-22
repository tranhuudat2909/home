//import './App.css';
import Home from './components/Home'
import About from "./components/About";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Home/>
//       </header>
//     </div>
//   );
// }


function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Router>
              <Routes>
                  <Route
                      exact
                      path="/"
                      element={<Home />}
                  />

                  <Route
                      path="/about"
                      element={<About />}
                  />

              </Routes>
        </Router>
        </header>
    </div>
  );
}

export default App;
