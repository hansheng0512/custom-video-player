import React, { useState } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Video Player</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Features List */}
      <div
        className={`
          ${isSidebarOpen ? 'block' : 'hidden'} 
          md:block 
          w-full md:w-80 
          bg-gray-800 
          text-white 
          p-6 
          fixed 
          md:sticky 
          top-0 
          h-screen 
          overflow-y-auto
          z-20
        `}
      >
        <div className="hidden md:block mb-8">
          <h1 className="text-2xl font-bold">Video Player</h1>
          <p className="text-gray-400 mt-2">Backward-only seeking player</p>
        </div>

        <nav className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Features</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Backward seeking only</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Custom video controls</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Fullscreen support</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Keyboard shortcuts prevention</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Mouse-based seeking protection</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Instructions</h2>
            <div className="text-gray-300 space-y-2">
              <p>• Click play to start video</p>
              <p>• Use rewind button to go back</p>
              <p>• Toggle fullscreen as needed</p>
              <p>• Adjust volume with mute button</p>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content - Video Player */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="aspect-video w-full">
              <VideoPlayer
                videoUrl="video-url"
                className="h-full"
              />
            </div>
          </div>

          {/* Mobile Features List */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4 md:hidden">
            <h2 className="text-lg font-semibold text-white mb-2">Quick Guide</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Tap rewind to go backward</li>
              <li>• No fast-forward available</li>
              <li>• Double-tap for fullscreen</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;