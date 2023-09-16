import React from 'react';
import './App.css';
import TextFileReader from './TextFileReader'; // 新しいコンポーネントをインポート

function App() {
  return (
    <div className="App">
      <TextFileReader /> {/* 新しいコンポーネントを使用 */}
    </div>
  );
}

export default App;
