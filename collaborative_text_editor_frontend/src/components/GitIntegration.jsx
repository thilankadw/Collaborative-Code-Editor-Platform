import { useEffect, useState } from 'react';
import GitHubAuth from './GitHubAuth';
import GitOperationsPanel from './GitOperationsPanel';
import GitHubReposList from './GitHubReposList';
import useGitStore from '../stores/gitStore';
import { Link } from 'react-router-dom';

const GitIntegration = () => {
  const [projectPath, setProjectPath] = useState('enter your project path here...');
  const { accessToken } = useGitStore();
  const [gitToken, setGitToken] = useState(null);

  const handleRepoSelect = (repo) => {
    console.log('Selected repo:', repo);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('github_access_token');
    setGitToken(savedToken);
  }, [])


  return (
    <div className="git-integration flex flex-col justify-center items-center min-h-screen bg-gray-900 p-6 text-white">
      <div className="text-white text-6xl flex items-center gap-4">
        GIT
      </div>
      <Link
        to="/"
        className="text-gray-400 text-sm hover:text-white transition-colors mt-4"
      >
        ← Back to Home
      </Link>

      <div className="project-path max-w-3xl min-w-2xl mx-auto my-6 mt-8">
        <label className="flex flex-col md:flex-row md:items-center gap-2 bg-gray-800 bg-opacity-60 p-4 rounded-lg">
          <span className="whitespace-nowrap font-medium">Project Path:</span>
          <input
            type="text"
            value={projectPath}
            onChange={(e) => setProjectPath(e.target.value)}
            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
          />
        </label>
      </div>

      <div className="github-auth-section max-w-3xl mx-auto mb-8 flex justify-center">
        {!gitToken ? (
          <GitHubAuth />
        ) : (
          <div className="bg-green-900 bg-opacity-30 text-green-300 px-6 py-3 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            GitHub connected successfully!
          </div>
        )}
      </div>

      <div className="git-content max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="git-operations">
          <GitOperationsPanel projectPath={projectPath} />
        </div>

        <div className="github-repos">
          <GitHubReposList onSelectRepo={handleRepoSelect} />
        </div>
      </div>
    </div>
  );
};

export default GitIntegration;