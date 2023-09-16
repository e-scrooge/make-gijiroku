import React, { useState, useEffect } from 'react';
import './TextFileReader.css';
const { OpenAI } = require("openai");

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('環境変数 REACT_APP_OPENAI_API_KEY が設定されていません。');
  }

// OpenAI APIの設定を行います
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

function App() {
  const [fileContent, setFileContent] = useState('');
  const [fileChunks, setFileChunks] = useState([]);
  const [summarizedChunks, setSummarizedChunks] = useState([]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith('.vtt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setFileContent(content);

        const chunks = [];
        for (let i = 0; i < content.length; i += 7000) {
          chunks.push(content.slice(i, i + 7000));
        }
        setFileChunks(chunks);

        // チャンクごとに要約を実行
        summarizeChunks(chunks);
      };
      reader.readAsText(file);
    }
  };

  // チャンクの要約を実行する関数
  const summarizeChunks = async (chunks) => {
    const summarized = [];
    for (const chunk of chunks) {
      try {
        const response = await openai.chat.completions.create({
          //engine: 'text-davinci-003',
          //prompt: `要約してください：\n${chunk}`,
          //max_tokens: 100, // 要約の最大トークン数を設定
          messages: [{ role: "user", content: `要約してください：\n${chunk}` }],
          model: "gpt-3.5-turbo",
        });
        summarized.push(response.data.choices[0].text);
      } catch (error) {
        console.error(error);
        summarized.push('要約に失敗しました。');
      }
    }
    setSummarizedChunks(summarized);
  };

  useEffect(() => {
    // チャンクが変更されたときに要約を実行
    summarizeChunks(fileChunks);
  }, [fileChunks]);

  return (
    <div>
      <h1>テキストファイル読み込みアプリ</h1>
      <input
        type="file"
        accept=".vtt"
        onChange={handleFileInputChange}
        className="file-input"
      />
      <div>
        <h2>ファイルの内容:</h2>
        <pre className="file-content">{fileContent}</pre>
      </div>
      <div>
        <h2>ファイルのチャンク:</h2>
        <ul>
          {summarizedChunks.map((chunk, index) => (
            <li key={index}>{chunk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
