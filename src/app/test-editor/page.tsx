'use client';

import EditorJs from '@/components/EditorJs';
import { useState } from 'react';

export default function TestEditorPage() {
  const [content, setContent] = useState();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-2xl text-white mb-4">EditorJs Minimal Test</h1>
      <div className="w-full max-w-2xl">
        <EditorJs data={content} onChange={setContent} />
      </div>
    </div>
  );
} 