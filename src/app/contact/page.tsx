'use client';

import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';
import Script from 'next/script';

export default function Contact() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Google AdSense Ad */}
        <div className="mb-8">
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5290244357086785"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5290244357086785"
            data-ad-slot="7081915067"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <Script id="adsbygoogle-init">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Contact Me</h1>
          <p className="text-xl text-gray-300">
            Let's connect and explore the future of AI together
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center space-x-12"
        >
          <a
            href="https://www.linkedin.com/in/bruce-ai-jsh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#0077B5] transition-colors transform hover:scale-110"
          >
            <FaLinkedin className="h-14 w-14" />
          </a>
          <a
            href="https://www.facebook.com/bruce.jsh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#4267B2] transition-colors transform hover:scale-110"
          >
            <FaFacebook className="h-14 w-14" />
          </a>
          <a
            href="https://github.com/Jung-336"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#333] transition-colors transform hover:scale-110"
          >
            <FaGithub className="h-14 w-14" />
          </a>
        </motion.div>
      </div>
    </div>
  );
} 