import { useEffect, useState } from 'react';
import axios from 'axios';

const GitHubReposList = ({ onSelectRepo }) => {
  const [gitToken, setgitToken] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserRepos = async (accessToken = gitToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: { Authorization: `token ${accessToken}` },
      });
      setRepos(response.data);
    } catch (err) {
      setError('Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('github_access_token');
    if (savedToken) {
      setgitToken(savedToken);
      fetchUserRepos(savedToken);
    }
  }, []);

  if (!gitToken) {
    return <p className="text-white opacity-70 text-center py-4">Connect your GitHub account to view repositories</p>;
  }

  if (loading) return <div className="text-white text-center py-4 animate-pulse">Loading repositories...</div>;
  if (error) return <div className="text-red-400 bg-red-900 bg-opacity-30 p-4 rounded-lg">{error}</div>;

  return (
    <div className="github-repos-list bg-gray-800 bg-opacity-60 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Your GitHub Repositories</h3>
        <button
          onClick={() => fetchUserRepos()}
          disabled={loading}
          className="text-sm bg-gray-700 text-gray-300 px-3 py-1 rounded-md hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Refresh
        </button>
      </div>
      <ul className="space-y-3 max-h-[665px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {repos.length === 0 ? (
          <li className="text-gray-400 text-center py-4">No repositories found</li>
        ) : (
          repos.map((repo) => (
            <li key={repo.id} className="bg-gray-700 bg-opacity-60 rounded-lg p-3 hover:bg-gray-600 transition duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-medium">{repo.name}</h4>
                  <span className="text-xs text-gray-400">{repo.clone_url}</span>
                </div>
                {/* <button
                  onClick={() => onSelectRepo(repo)}
                  className="bg-tertiary text-sm px-3 py-1 rounded-md hover:bg-opacity-80 transition duration-300 flex items-center gap-1"
                >
                  Select
                </button> */}
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${repo.private ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                  {repo.private ? 'Private' : 'Public'}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GitHubReposList;
