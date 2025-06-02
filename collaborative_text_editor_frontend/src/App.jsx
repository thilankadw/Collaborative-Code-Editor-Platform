import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './screens/login';
import Register from './screens/register';
import CodeEditor from './screens/editor';
import RoomLogin from './screens/roomlogin';
import Home from './screens/home';
import { Toaster } from 'react-hot-toast';
import GitIntegration from './components/GitIntegration';
import UserProjects from './screens/allprojects';
import CreateProjectScreen from './screens/createproject';
import GitHubAuth from './components/GitHubAuth';

function App() {
  return (

    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/room-login" element={<RoomLogin />} />
        <Route path="/git-integration" element={<GitIntegration />} />
        <Route path="/all-projects" element={<UserProjects />} />
        <Route path="/create-project" element={<CreateProjectScreen />} />
        <Route path="/editor/:projectid" element={<CodeEditor />} />
        <Route path="/github-auth" element={<GitHubAuth />} />
      </Routes>

    </Router>

  );
}

export default App;