import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io("http://127.0.0.1:5003", {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'],
});

function App() {
  const [inputText, setInputText] = useState('');
  const [temperature, setTemperature] = useState(1.0);
  const [topK, setTopK] = useState(5);
  const [doSample, setDoSample] = useState(true);
  const [tokenSelection, setTokenSelection] = useState(200);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Sunucuya bağlanıldı');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      console.log('Sunucudan bağlantı kesildi');
    });

    socket.on('new_word', (data) => {
      setInputText((prevText) => prevText + data.word + ' ');
    });

    socket.on('connect_error', (err) => {
      console.error('Bağlantı hatası:', err);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new_word');
      socket.off('connect_error');
    };
  }, []);

  const sendMessage = () => {
    socket.emit('chat_message', {
      text: inputText,
      temperature: temperature,
      top_k: topK,
      do_sample: doSample,
      token_selection: tokenSelection,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white justify-center items-center">
      <header className="bg-blue-600 text-5xl font-bold p-4 text-center w-full">
        TurkishGPT
      </header>
      <div className="flex flex-col w-full max-w-4xl h-full justify-center items-center space-y-4 p-4">
        <textarea
          className="w-full h-72 p-4 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Metninizi girin"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />
        <div className="flex w-full space-x-4">
          <div className="flex flex-col w-1/4">
            <label className="flex flex-col items-center">
              Temperature:
              <input
                type="range"
                className="mt-2"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                step="0.1"
                min="0"
                max="2"
              />
              <span>{temperature}</span>
            </label>
          </div>
          <div className="flex flex-col w-1/4">
            <label className="flex flex-col items-center">
              Top K:
              <input
                type="range"
                className="mt-2"
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                min="0"
                max="100"
              />
              <span>{topK}</span>
            </label>
          </div>
          <div className="flex items-center w-1/4">
            <label className="flex items-center">
              Do Sample:
              <input
                type="checkbox"
                className="ml-2"
                checked={doSample}
                onChange={(e) => setDoSample(e.target.checked)}
              />
            </label>
          </div>
          <div className="flex flex-col w-1/4">
            <label className="flex flex-col items-center">
              Max New Token (0-1024):
              <input
                type="range"
                className="mt-2"
                value={tokenSelection}
                onChange={(e) => setTokenSelection(parseInt(e.target.value))}
                min="0"
                max="1024"
              />
              <span>{tokenSelection}</span>
            </label>
          </div>
        </div>
        <button
          onClick={sendMessage}
          className="w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default App;
