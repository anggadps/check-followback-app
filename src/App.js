import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [nonFollowBack, setNonFollowBack] = useState([]);
  const [followingFile, setFollowingFile] = useState(null);
  const [followersFile, setFollowersFile] = useState(null);
  const [language, setLanguage] = useState('en'); // State untuk bahasa
  const [errorMessage, setErrorMessage] = useState(null); // State untuk error

  const translations = {
    en: {
      title: "Check Accounts Not Following Back",
      uploadFollowing: "Upload your following.json:",
      uploadFollowers: "Upload your followers.json:",
      processFiles: "Process Files",
      nonFollowBack: "Accounts not following back (href):",
      noData: "All accounts follow back or no files uploaded.",
      alertMessage: "Please upload both following.json and followers.json.",
      invalidJSON: "Invalid JSON format or incorrect data structure.",
      copyright: "© 2024 AnggaDPS",
      languageButton: "Switch to Indonesian"
    },
    id: {
      title: "Cek Akun yang Tidak Follback",
      uploadFollowing: "Unggah following.json kamu:",
      uploadFollowers: "Unggah followers.json kamu:",
      processFiles: "Proses File",
      nonFollowBack: "Akun yang tidak follow-back (href):",
      noData: "Semua akun sudah follback atau belum ada file yang diunggah.",
      alertMessage: "Mohon unggah kedua file following.json dan followers.json.",
      invalidJSON: "Format JSON tidak valid atau struktur data salah.",
      copyright: "© 2024 AnggaDPS",
      languageButton: "Ganti ke Bahasa Inggris"
    }
  };

  const t = translations[language];

  // Fungsi untuk membaca file JSON yang diunggah dengan validasi format
  const readJSONFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        callback(data);
      } catch (error) {
        setErrorMessage(t.invalidJSON);
        console.error('Invalid JSON:', error);
      }
    };
    reader.readAsText(file);
  };

  // Fungsi untuk validasi struktur data following
  const isValidFollowingData = (data) => {
    return (
      data && 
      data.relationships_following &&
      Array.isArray(data.relationships_following) &&
      data.relationships_following.every(item => item.string_list_data && Array.isArray(item.string_list_data))
    );
  };

  // Fungsi untuk validasi struktur data followers
  const isValidFollowersData = (data) => {
    return (
      data &&
      Array.isArray(data) &&
      data.every(item => item.string_list_data && Array.isArray(item.string_list_data))
    );
  };

  // Fungsi untuk memproses following dan followers dengan validasi
  const processFollowData = (followingData, followersData) => {
    if (!isValidFollowingData(followingData) || !isValidFollowersData(followersData)) {
      setErrorMessage(t.invalidJSON);
      return;
    }

    setErrorMessage(null); // Reset error jika data valid

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
      alert(t.alertMessage);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <div className="App container mt-5">
      <div className="card p-4 shadow-lg">
        <h1 className="text-center mb-4">{t.title}</h1>
        
        <button className="btn btn-secondary mb-3" onClick={toggleLanguage}>
          {t.languageButton}
        </button>
        
        <div className="mb-3">
          <h5>{t.uploadFollowing}</h5>
          <input
            type="file"
            className="form-control"
            accept=".json"
            onChange={(e) => setFollowingFile(e.target.files[0])}
          />
        </div>

        <div className="mb-4">
          <h5>{t.uploadFollowers}</h5>
          <input
            type="file"
            className="form-control"
            accept=".json"
            onChange={(e) => setFollowersFile(e.target.files[0])}
          />
        </div>

        <button className="btn btn-primary btn-block mb-4" onClick={handleFileUpload}>
          {t.processFiles}
        </button>

        {errorMessage && (
          <div className="alert alert-danger">
            {errorMessage}
          </div>
        )}

        <h4 className="text-center">{t.nonFollowBack}</h4>
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
            <p className="text-center mt-3">{t.noData}</p>
          )}
        </ul>

        <footer className="text-center mt-5">
          <p>{t.copyright}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
