import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [nonFollowBack, setNonFollowBack] = useState([]);
  const [followingFile, setFollowingFile] = useState(null);
  const [followersFile, setFollowersFile] = useState(null);
  const [language, setLanguage] = useState('en'); // State untuk bahasa

  const translations = {
    en: {
      title: "Check Accounts Not Following Back",
      uploadFollowing: "Upload your following.json:",
      uploadFollowers: "Upload your followers.json:",
      processFiles: "Process Files",
      nonFollowBack: "Accounts not following back (href):",
      noData: "All accounts follow back or no files uploaded.",
      alertMessage: "Please upload both following.json and followers.json.",
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
      copyright: "© 2024 AnggaDPS",
      languageButton: "Ganti ke Bahasa Inggris"
    }
  };

  const t = translations[language];

  const readJSONFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);
      callback(data);
    };
    reader.readAsText(file);
  };

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
