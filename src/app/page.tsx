"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, GitCompare, ArrowDown, ArrowLeft } from 'lucide-react';
import prettier from 'prettier/standalone';
import parserGraphql from 'prettier/parser-graphql';
import { triggerFireworks } from '@/utils/animations';
import { safeJsonParse } from '@/utils/jsonUtils';
import Header from '@/components/layout/Header';
import InputPanel from '@/components/ui/InputPanel';
import OutputPanel from '@/components/ui/OutputPanel';
import type { Theme, Mode, ActiveTab, ViewMode, FormatOutput, CompareOutput, ProcessStatus } from '@/types';

export default function Maktavify() {
  const [mode, setMode] = useState<Mode>('format');
  const [activeTab, setActiveTab] = useState<ActiveTab>('json');
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [output, setOutput] = useState<FormatOutput | CompareOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [theme, setTheme] = useState<Theme>('dark');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  // Reset to input view when mode changes
  useEffect(() => {
    setShowOutput(false);
    setOutput(null);
    setError(null);
    setStatus('idle');
  }, [mode]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [theme]);

  const handleProcess = useCallback(async () => {
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
        const parsed = safeJsonParse(input);
        setOutput({ type: 'json', data: parsed } as FormatOutput);
        setStatus('success');
        setShowOutput(true);
        triggerFireworks();
      } else {
        const formatted = await prettier.format(input, {
          parser: "graphql",
          plugins: [parserGraphql],
        });
        setOutput({ type: 'graphql', data: formatted } as FormatOutput);
        setStatus('success');
        setShowOutput(true);
        triggerFireworks();
      }
    } catch (err: unknown) {
      setStatus('error');
      setShowOutput(true);
      const errorMessage = err instanceof Error ? err.message : "Invalid format! Please check your data.";
      setError(errorMessage);
    }
  }, [input, activeTab]);

  /** Type guard to check if output is FormatOutput */
  const isFormatOutput = (out: FormatOutput | CompareOutput | null): out is FormatOutput => {
    return out !== null && 'type' in out && 'data' in out;
  };

  const handleCompare = useCallback(() => {
    setError(null);
    setStatus('idle');
    setOutput(null);

    if (!input.trim() || !input2.trim()) {
      setStatus('error');
      setError("Please enter data in both fields!");
      return;
    }

    try {
      const json1 = safeJsonParse(input);
      const json2 = safeJsonParse(input2);
      setOutput({ json1, json2 } as CompareOutput);
      setStatus('success');
      setShowOutput(true);
      triggerFireworks();
    } catch (err: unknown) {
      setStatus('error');
      setShowOutput(true);
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON! Please check your data.";
      setError(errorMessage);
    }
  }, [input, input2]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    let textToCopy: string;
    if (isFormatOutput(output)) {
      textToCopy = output.type === 'json'
        ? JSON.stringify(output.data, null, 2)
        : String(output.data);
    } else {
      textToCopy = JSON.stringify(output, null, 2);
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    let dataStr: string;
    let fileType: string;

    if (isFormatOutput(output)) {
      dataStr = output.type === 'json'
        ? JSON.stringify(output.data, null, 2)
        : String(output.data);
      fileType = output.type;
    } else {
      dataStr = JSON.stringify(output, null, 2);
      fileType = 'json';
    }

    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `formatted-${fileType}.${fileType === 'graphql' ? 'graphql' : 'json'}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [output]);

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
          showOutput ? (
            /* Output View - Fullscreen */
            <div className="space-y-4">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOutput(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                aria-label="Back to input"
              >
                <ArrowLeft size={18} />
                <span>Back to Input</span>
              </motion.button>
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
            /* Input View - Button at top for easy access */
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleProcess}
                  className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/40 flex items-center justify-center"
                  aria-label="Format data"
                >
                  <Zap className="text-white" size={32} />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>
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
            </div>
          )
        ) : (
          showOutput ? (
            /* Compare Output View - Fullscreen */
            <div className="space-y-4">
              <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOutput(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                aria-label="Back to input"
              >
                <ArrowLeft size={18} />
                <span>Back to Input</span>
              </motion.button>
              <OutputPanel
                status={status}
                error={error}
                output={output}
                theme={theme}
                mode={mode}
              />
            </div>
          ) : (
            /* Compare Input View - Button at top for easy access */
            <div className="space-y-4">
              <div className="flex justify-center py-4">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCompare}
                  className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-2xl shadow-blue-500/40 flex items-center justify-center"
                  aria-label="Compare JSONs"
                >
                  <GitCompare className="text-white" size={28} strokeWidth={2.5} />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}