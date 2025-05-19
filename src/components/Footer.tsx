'use client';

import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-500 mb-4">Bruce AI Blog</h3>
            <p className="text-gray-400">
              Exploring the frontiers of AI, technology, and innovation in the digital age.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-blue-500 mb-4">Connect</h3>
            <div className="flex space-x-6">
              <a
                href="https://github.com/Jung-336"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#333] transition-colors transform hover:scale-110"
              >
                <FaGithub className="h-7 w-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/bruce-ai-jsh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#0077B5] transition-colors transform hover:scale-110"
              >
                <FaLinkedin className="h-7 w-7" />
              </a>
              <a
                href="https://www.facebook.com/bruce.jsh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#4267B2] transition-colors transform hover:scale-110"
              >
                <FaFacebook className="h-7 w-7" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bruce AI Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 