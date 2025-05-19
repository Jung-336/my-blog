"use client";

import React, { useRef } from 'react';
import { createReactEditorJS } from 'react-editor-js';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Code from '@editorjs/code';
import { uploadImage } from '@/lib/upload';

const ReactEditorJS = createReactEditorJS();

export default function EditorJs({ data, onChange }: { data?: any, onChange?: (data: any) => void }) {
  const editorCore = useRef(null);

  // 이미지 업로드 핸들러
  const imageToolConfig = {
    class: ImageTool,
    config: {
      uploader: {
        async uploadByFile(file: File) {
          const url = await uploadImage(file);
          return {
            success: 1,
            file: { url },
          };
        },
      },
    },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-md p-2">
      <ReactEditorJS
        tools={{
          header: Header,
          list: List,
          code: Code,
          image: imageToolConfig,
        }}
        defaultValue={data}
        onChange={async (api) => {
          const outputData = await api.saver.save();
          onChange?.(outputData);
        }}
        holder="editorjs"
      />
    </div>
  );
} 