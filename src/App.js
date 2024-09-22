import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import custom CSS

function App() {
  const [nonFollowBack, setNonFollowBack] = useState([]);
  const [followingFile, setFollowingFile] = useState(null);
  const [followersFile, setFollowersFile] = useState(null);

  // Fungsi untuk membaca file JSON yang diunggah
  const readJSONFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      callback(data);
    };
    reader.readAsText(file);
  };

  // Fungsi untuk memproses following dan followers
  const processFollowData = (followingData, followersData) => {
    const followingMap = {};
    followingData.relationships_following.forEach((relation) => {
      relation.string_list_data.forEach((account) => {
        followingMap[account.value] = account.href;
      });
    });

    const followersMap = {};
    followersData.forEach((follower) => {
      follower.string_list_data.forEach((account) => {
        followersMap[account.value] = true;
      });
    });

    const nonFollowBackAccounts = Object.keys(followingMap).filter(
      (account) => !followersMap[account]
    );

    setNonFollowBack(nonFollowBackAccounts.map(account => followingMap[account]));
  };

  const handleFileUpload = () => {
    if (followingFile && followersFile) {
      readJSONFile(followingFile, (followingData) => {
        readJSONFile(followersFile, (followersData) => {
          processFollowData(followingData, followersData);
        });
      });
    } else {
      alert("Mohon unggah kedua file following.json dan followers.json.");
    }
  };

  return (
    <div className="App container mt-5">
      <div className="card p-4 shadow-lg">
        <h1 className="text-center mb-4">Check Accounts Not Following Back</h1>
        
        <div className="mb-3">
          <h5>Upload your <strong>following.json</strong>:</h5>
          <input
            type="file"
            className="form-control"
            accept=".json"
            onChange={(e) => setFollowingFile(e.target.files[0])}
          />
        </div>

        <div className="mb-4">
          <h5>Upload your <strong>followers.json</strong>:</h5>
          <input
            type="file"
            className="form-control"
            accept=".json"
            onChange={(e) => setFollowersFile(e.target.files[0])}
          />
        </div>

        <button className="btn btn-primary btn-block mb-4" onClick={handleFileUpload}>
          Process Files
        </button>

        <h4 className="text-center">Akun yang tidak follow-back (href):</h4>
        <ul className="list-group">
          {nonFollowBack.length > 0 ? (
            nonFollowBack.map((href, index) => (
              <li key={index} className="list-group-item">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {href}
                </a>
              </li>
            ))
          ) : (
            <p className="text-center mt-3">Semua akun sudah follback atau belum ada file yang diunggah.</p>
          )}
        </ul>

        <footer className="text-center mt-5">
          <p>&copy; 2024 AnggaDPS</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
