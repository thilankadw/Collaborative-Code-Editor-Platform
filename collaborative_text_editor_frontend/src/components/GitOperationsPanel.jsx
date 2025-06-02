import { useEffect, useState } from 'react';
import useGitStore from '../stores/gitStore';

const GitOperationsPanel = ({ projectPath }) => {
  const {
    gitStatus,
    loading,
    error,
    initRepo,
    cloneRepo,
    commitChanges,
    pushChanges,
    pullChanges,
    clearError
  } = useGitStore();

  const [cloneUrl, setCloneUrl] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [remote, setRemote] = useState('origin');
  const [branch, setBranch] = useState('main');
  const [gitToken, setgitToken] = useState(null);

  const handleInit = async () => {
    await initRepo(projectPath);
  };

  const handleClone = async () => {
    await cloneRepo(cloneUrl, projectPath);
  };

  const handleCommit = async () => {
    await commitChanges(projectPath, commitMessage);
    setCommitMessage('');
  };

  const handlePush = async () => {
    await pushChanges(projectPath, remote, branch);
  };

  const handlePull = async () => {
    await pullChanges(projectPath, remote, branch);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('github_access_token');
    if (savedToken) {
      setgitToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (projectPath) {
      const { getStatus } = useGitStore.getState();
      getStatus(projectPath);
    }
  }, [projectPath]);

  return (
    <div className="git-operations-panel bg-gray-800 bg-opacity-60 p-6 rounded-lg">
      {error && (
        <div className="error bg-red-900 bg-opacity-30 text-red-200 p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="bg-red-800 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition duration-300"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="git-section mb-6 border-b border-gray-700 pb-6">
        <h3 className="font-medium mb-3 text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8"></path>
            <path d="M8 12h8"></path>
          </svg>
          Initialize Repository
        </h3>
        <button
          onClick={handleInit}
          disabled={loading}
          className="w-full bg-tertiary py-2 rounded-md hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8.7l-5.1 5.2-2.8-2.7L7 15"></path>
              </svg>
              Git Init
            </>
          )}
        </button>
      </div>

      <div className="git-section mb-6 border-b border-gray-700 pb-6">
        <h3 className="font-medium mb-3 text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
          </svg>
          Clone Repository
        </h3>
        <input
          type="text"
          value={cloneUrl}
          onChange={(e) => setCloneUrl(e.target.value)}
          placeholder="https://github.com/user/repo.git"
          className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px] mb-4"
        />
        <button
          onClick={handleClone}
          disabled={loading || !cloneUrl}
          className="w-full bg-tertiary py-2 rounded-md hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cloning...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              </svg>
              Clone
            </>
          )}
        </button>
      </div>

      <div className="git-section mb-6 border-b border-gray-700 pb-6">
        <h3 className="font-medium mb-3 text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M12 20.24s1.56-1.56 3.12-3.12l-3.12-3.12-3.12 3.12c1.56 1.56 3.12 3.12 3.12 3.12z"></path>
            <path d="M12 12v8.24"></path>
            <path d="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
          </svg>
          Commit Changes
        </h3>
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Commit message"
          className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px] mb-4"
        />
        <button
          onClick={handleCommit}
          disabled={loading || !commitMessage || !gitStatus?.files?.length}
          className="w-full bg-tertiary py-2 rounded-md hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Committing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M12 20.24s1.56-1.56 3.12-3.12l-3.12-3.12-3.12 3.12c1.56 1.56 3.12 3.12 3.12 3.12z"></path>
                <path d="M12 12v8.24"></path>
                <path d="M12 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"></path>
              </svg>
              Commit
            </>
          )}
        </button>
      </div>

      <div className="git-section mb-6">
        <h3 className="font-medium mb-3 text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
          </svg>
          Push/Pull
        </h3>
        <div className="remote-controls grid grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={remote}
            onChange={(e) => setRemote(e.target.value)}
            placeholder="remote"
            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
          />
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="branch"
            className="w-full px-4 py-2 rounded bg-primary text-white focus:outline-none text-[12px]"
          />
        </div>
        <div className="push-pull-buttons grid grid-cols-2 gap-3">
          <button
            onClick={handlePush}
            disabled={loading}
            className="bg-tertiary py-2 rounded-md hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                Push
              </>
            )}
          </button>
          <button
            onClick={handlePull}
            disabled={loading}
            className="bg-tertiary py-2 rounded-md hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M7 13l5 5m0 0l5-5m-5 5V6"></path>
                </svg>
                Pull
              </>
            )}
          </button>
        </div>
      </div>

      {gitStatus && (
        <div className="git-status mt-8 bg-gray-700 bg-opacity-40 p-4 rounded-lg">
          <h3 className="font-medium mb-3 text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Repository Status
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Branch</p>
              <p className="text-white font-medium">{gitStatus.current}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Ahead</p>
              <p className="text-white font-medium">{gitStatus.ahead || 0}</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Behind</p>
              <p className="text-white font-medium">{gitStatus.behind || 0}</p>
            </div>
          </div>
          {gitStatus.files?.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2 text-gray-300">Changed Files:</h4>
              <ul className="bg-gray-800 rounded-lg overflow-hidden divide-y divide-gray-700 max-h-48 overflow-y-auto">
                {gitStatus.files.map((file, index) => (
                  <li key={index} className="px-3 py-2 flex justify-between items-center hover:bg-gray-700 transition duration-200">
                    <span className="text-white truncate">{file.path}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${file.index === 'A' ? 'bg-green-900 text-green-200' :
                      file.index === 'M' ? 'bg-blue-900 text-blue-200' :
                        file.index === 'D' ? 'bg-red-900 text-red-200' :
                          'bg-gray-700 text-gray-300'
                      }`}>
                      {file.index}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitOperationsPanel;