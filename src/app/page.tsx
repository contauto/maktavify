"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, GitCompare, ArrowDown } from 'lucide-react';
import prettier from 'prettier/standalone';
import parserGraphql from 'prettier/parser-graphql';
import { triggerFireworks } from '@/utils/animations';
import Header from '@/components/layout/Header';
import InputPanel from '@/components/ui/InputPanel';
import OutputPanel from '@/components/ui/OutputPanel';

export default function Maktavify() {
  const [mode, setMode] = useState('format');
  const [activeTab, setActiveTab] = useState('json');
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [output, setOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('idle');
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('tree');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  const handleProcess = async () => {
    setError(null);
    setStatus('idle');
    setOutput(null);

    if (!input.trim()) {
      setStatus('error');
      setError("Please enter some data first!");
      return;
    }

    try {
      if (activeTab === 'json') {
        const parsed = JSON.parse(input);
        setOutput({ type: 'json', data: parsed });
        setStatus('success');
        triggerFireworks();
      } else {
        const formatted = await prettier.format(input, {
          parser: "graphql",
          plugins: [parserGraphql],
        });
        setOutput({ type: 'graphql', data: formatted });
        setStatus('success');
        triggerFireworks();
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message || "Invalid format! Please check your data.");
    }
  };

  const handleCompare = () => {
    setError(null);
    setStatus('idle');
    setOutput(null);

    if (!input.trim() || !input2.trim()) {
      setStatus('error');
      setError("Please enter data in both fields!");
      return;
    }

    try {
      const json1 = JSON.parse(input);
      const json2 = JSON.parse(input2);
      setOutput({ json1, json2 });
      setStatus('success');
      triggerFireworks();
    } catch (err: any) {
      setStatus('error');
      setError(err.message || "Invalid JSON! Please check your data.");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    const textToCopy = output.type === 'json' ? JSON.stringify(output.data, null, 2) : output.type === 'graphql' ? output.data : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const dataStr = output.type === 'json' ? JSON.stringify(output.data, null, 2) : output.type === 'graphql' ? output.data : JSON.stringify(output, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `formatted-${output.type || 'data'}.${output.type === 'graphql' ? 'graphql' : 'json'}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetInput: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (targetInput === 'input1') {
            setInput(event.target.result as string);
          } else {
            setInput2(event.target.result as string);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20' : 'bg-gradient-to-br from-indigo-100/40 via-transparent to-purple-100/40'}`} />
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto p-3 sm:p-4 md:p-6">
        <Header 
          theme={theme} 
          setTheme={setTheme} 
          mode={mode} 
          setMode={setMode} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {mode === 'format' ? (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6">
            <InputPanel 
              label="Input" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onClear={() => setInput('')} 
              onUpload={(e) => handleFileUpload(e, 'input1')} 
              theme={theme} 
              activeTab={activeTab}
              placeholder={activeTab === 'json' ? '{\n  "name": "John",\n  "age": 30\n}' : 'query {\n  user(id: "1") {\n    name\n    email\n  }\n}'}
            />

            <div className="flex lg:flex-col items-center justify-center gap-4 py-2 lg:py-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleProcess}
                className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/40 flex items-center justify-center"
              >
                <ArrowDown className="text-white lg:hidden" size={28} strokeWidth={2.5} />
                <Zap className="text-white hidden lg:block" size={36} />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            <OutputPanel 
              status={status}
              error={error}
              output={output}
              theme={theme}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
              mode={mode}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1fr_auto_1fr] gap-4 md:gap-6">
            <InputPanel 
              label="JSON 1" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onClear={() => setInput('')} 
              onUpload={(e) => handleFileUpload(e, 'input1')} 
              theme={theme} 
              activeTab="json"
              placeholder='{\n  "name": "John",\n  "age": 30\n}'
            />

            <InputPanel 
              label="JSON 2" 
              value={input2} 
              onChange={(e) => setInput2(e.target.value)} 
              onClear={() => setInput2('')} 
              onUpload={(e) => handleFileUpload(e, 'input2')} 
              theme={theme} 
              activeTab="json"
              placeholder='{\n  "name": "Jane",\n  "age": 25\n}'
              initialX={-10}
            />

            <div className="flex lg:flex-col items-center justify-center py-2 lg:py-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCompare}
                className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center"
              >
                <GitCompare className="text-white" size={28} strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            <OutputPanel 
              status={status}
              error={error}
              output={output}
              theme={theme}
              mode={mode}
            />
          </div>
        )}
      </div>
    </div>
  );
}