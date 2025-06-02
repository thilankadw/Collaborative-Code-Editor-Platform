import { useEffect } from 'react';
import axios from 'axios';
import api from '../api/api';
import useGitStore from '../stores/gitStore';
import { useNavigate } from 'react-router-dom';

const GitHubAuth = () => {
  const { setAccessToken } = useGitStore();
  const navigate = useNavigate();

  const handleAuth = () => {
    const clientId = 'Ov23liTae4WNJqAamzvi';
    const redirectUri = encodeURIComponent(`${window.location.origin}/github-auth`);
    const scope = encodeURIComponent('repo user');
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    window.location.href = url;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (code && window.location.pathname === '/github-auth') {
      const exchangeToken = async () => {
        try {
          const response = await api.post('/api/github/oauth', { code });
          const accessToken = response.data.accessToken;
          setAccessToken(accessToken);
          localStorage.setItem('github_access_token', accessToken);
          // await fetchUserRepos(accessToken);
          navigate('/git-integration')
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('GitHub OAuth error:', error);
        }
      };
  
      exchangeToken();
    }
  }, []);
  
  return (
    <button 
      onClick={handleAuth} 
      className="bg-tertiary px-6 py-3 rounded-full flex items-center gap-2 transition duration-300 
                hover:bg-opacity-80 hover:scale-105 hover:shadow-lg hover:text-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      Connect GitHub Account
    </button>
  );
};

export default GitHubAuth;