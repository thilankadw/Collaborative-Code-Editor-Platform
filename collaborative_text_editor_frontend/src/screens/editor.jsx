import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { initSocket } from "../utils/socket";
import axios from "axios";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const CodeEditor = () => {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const editorRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const ignoreChanges = useRef(false);

  useEffect(() => {

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!location.state?.formData) {
      navigate("/");
      return;
    }

    const init = async () => {
      try {
        socketRef.current = await initSocket();

        socketRef.current.on("connect_error", handleError);
        socketRef.current.on("connect_failed", handleError);

        function handleError(e) {
          console.error("Socket error:", e);
          alert("Failed to connect to the server. Please try again.");
          navigate("/");
        }

        socketRef.current.emit("join", {
          projectid: location.state.formData.projectId,
          username: location.state.formData.username,
          secretCode: location.state.formData.secretCode
        });

        socketRef.current.on("joined", ({ clients, username }) => {
          if (username !== location.state.formData.username) {
            console.log(`${username} joined the project`);
          }
          setClients(clients);
        });

        socketRef.current.on("project_data", ({ files }) => {
          console.log("Received project data:", files);
          if (files && files.length > 0) {
            setFiles(files);
            setActiveFile(files[0]?.id);
          }
          setIsLoading(false);
        });

        socketRef.current.on("new_file", (newFile) => {
          console.log("New file created:", newFile);
          setFiles(prev => [...prev, newFile]);
        });

        socketRef.current.on("code_update", ({ fileId, content }) => {
          console.log(`Received code update for file ${fileId}`);

          ignoreChanges.current = true;

          setFiles(prevFiles =>
            prevFiles.map(file =>
              file.id === fileId ? { ...file, content } : file
            )
          );

          if (activeFile === fileId && editorRef.current) {
            const model = editorRef.current.getModel();
            if (model) {
              editorRef.current.setValue(content);
            }
          }

          setTimeout(() => {
            ignoreChanges.current = false;
          }, 100);
        });

        socketRef.current.on("user_left", ({ username, clients }) => {
          console.log(`${username} left the project`);
          setClients(clients);
        });

        socketRef.current.on("error", ({ message }) => {
          console.error("Server error:", message);
          alert(`Error: ${message}`);
        });
      } catch (error) {
        console.error("Initialization error:", error);
        alert("Failed to initialize the editor. Please try again.");
        navigate("/");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting socket");
        socketRef.current.disconnect();
      }
    };
  }, [location.state?.formData, navigate]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCreateFile = () => {
    let fileName = prompt("Enter new file name:");
    if (!fileName) return;

    if (fileName.endsWith(".js")) {
      fileName = fileName.slice(0, -3);
    }

    const finalFileName = `${fileName}.js`;

    socketRef.current.emit(
      "create_file",
      {
        projectid: location.state?.formData.projectId,
        filename: finalFileName
      },
      (newFile) => {
        if (newFile) {
          console.log("Created new file:", newFile);
          setFiles(prev => [...prev, newFile]);
          setActiveFile(newFile.id);
        }
      }
    );
  };


  const handleAnalyze = async () => {
    if (!activeFile) {
      alert("Please select a file to analyze.");
      return;
    }

    const currentFile = files.find(f => f.id === activeFile);
    if (!currentFile) return;

    try {
      const formData = new FormData();
      const fileBlob = new Blob([currentFile.content], { type: "text/plain" });
      formData.append("file", fileBlob, currentFile.name);

      const response = await axios.post("http://localhost:8000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.data;

      if (response.status !== 200) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysisResult(data);
      setShowAnalysis(true);
    } catch (error) {
      alert(error.message || "Failed to analyze code");
    }
  };

  const handleEditorChange = (value) => {
    if (ignoreChanges.current) return;

    if (!activeFile) return;

    setFiles(prevFiles => prevFiles.map(file =>
      file.id === activeFile ? { ...file, content: value } : file
    ));

    socketRef.current.emit("code_change", {
      projectid: location.state?.formData.projectId,
      fileId: activeFile,
      content: value
    });
  };

  const handleSaveLocally = async () => {
    if (!location.state?.formData) {
      alert("No project data to save.")
      return;
    }

    try {
      const zip = new JSZip();

      files.forEach(file => {
        const fileName = file.name.endsWith('.js') ? file.name : `${file.name}.js`;
        const pathParts = fileName.split('/');
        let currentFolder = zip;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i];
          currentFolder = currentFolder.folder(folderName) || currentFolder;
        }

        currentFolder.file(pathParts[pathParts.length - 1], file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `project_${location.state.formData.projectId}.zip`);

      alert('Project saved as ZIP file successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save project. Check console for details.');
    }

  }

  const getCurrentFileContent = () => {
    const currentFile = files.find(file => file.id === activeFile);
    return currentFile?.content || '';
  };

  if (!location.state?.formData) {
    return <div>Missing project data. Redirecting...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-xl">Loading project...</div>
      </div>
    );
  }


  if (!files) return <div>Loading...</div>;

  const AnalysisPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={() => setShowAnalysis(false)}
          className="absolute top-4 right-4 text-2xl hover:text-gray-300"
        >
          &times;
        </button>


        <h2 className="text-2xl font-bold mb-4">Code Analysis Results</h2>

        {analysisResult?.message ? (
          <p className="text-green-400">{analysisResult.message}</p>
        ) : (
          <>
            <AnalysisSection title="Errors" issues={analysisResult?.errors} />
            <AnalysisSection title="Code Smells" issues={analysisResult?.code_smells} />
            <AnalysisSection title="Potential Bugs" issues={analysisResult?.potential_bugs} />
          </>
        )}
      </div>
    </div>
  );

  const AnalysisSection = ({ title, issues }) => (
    issues?.length > 0 && (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div key={i} className="bg-gray-700 p-3 rounded">
              <p className="font-mono">
                {issue.line_number ? `Line ${issue.line_number}: ` : ""}
                {issue.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="flex height-100">
      <div className="flex flex-col justify-between py-4">
        <div className="w-[200px] text-white p-8">
          <div className="text-lg mb-2 flex justify-between items-center">
            Files
            {/* <button onClick={handleCreateFile} className="text-white text-3xl">+</button> */}
          </div>
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={`cursor-pointer text-white text-sm py-2 pl-4 my-2 ${activeFile === file.id ? 'font-bold' : ''
                }`}
            >
              {file.name}
            </div>
          ))}
          <button
            onClick={handleAnalyze}
            className="bg-tertiary text-white px-3 py-2 rounded hover:opacity-90 transition cursor-pointer text-sm mt-8 w-32"
          >
            Analyze
          </button>
          <button
            onClick={handleSaveLocally}
            className="bg-tertiary text-white px-3 py-2 rounded hover:opacity-90 transition cursor-pointer text-sm mt-2 w-32"
          >
            Save Locally
          </button>
        </div>
        <div className="w-[200px] text-white p-8">
          <div className="text-lg mb-4">Users</div>
          <div className="grid grid-cols-2 gap-4">
            {clients.map((client) => (
              <div
                key={client.socketId}
                className="bg-tertiary w-[50px] h-[50px] flex items-center justify-center text-2xl rounded-full ml-4"
              >
                {client.username.trim().charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end mx-4">
          <Link
            to="/"
            className="w-full bg-tertiary text-white py-2 rounded-lg hover:opacity-90 transition text-center text-xs"
          >
            Go Home
          </Link>
        </div>
      </div>

      <div style={{ flexGrow: 1 }}>
        <MonacoEditor
          height="100vh"
          language="javascript"
          value={files.find(f => f.id === activeFile)?.content || ''}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>

      {showAnalysis && <AnalysisPopup />}
    </div>
  );
};

export default CodeEditor;
