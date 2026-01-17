"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, GitCompare, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import prettier from 'prettier/standalone';
import parserGraphql from 'prettier/parser-graphql';
import { triggerFireworks } from '@/utils/animations';
import { safeJsonParse } from '@/utils/jsonUtils';
import { useSettings } from '@/context/SettingsContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InputPanel from '@/components/ui/InputPanel';
import OutputPanel from '@/components/ui/OutputPanel';
import type { Mode, ActiveTab, ViewMode, FormatOutput, CompareOutput, ProcessStatus } from '@/types';

export default function Maktavify() {
  const { t } = useTranslation();
  const { themeMode, layoutMode, animationsEnabled, currentTheme, getGradientStyle } = useSettings();

  const [mode, setMode] = useState<Mode>('format');
  const [activeTab, setActiveTab] = useState<ActiveTab>('json');
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [output, setOutput] = useState<FormatOutput | CompareOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [copied, setCopied] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    setShowOutput(false);
    setOutput(null);
    setError(null);
    setStatus('idle');
  }, [mode]);

  const handleProcess = useCallback(async () => {
    setError(null);
    setStatus('idle');
    setOutput(null);

    if (!input.trim()) {
      setStatus('error');
      setError(t('errors.empty_input'));
      return;
    }

    try {
      if (activeTab === 'json') {
        const parsed = safeJsonParse(input);
        setOutput({ type: 'json', data: parsed } as FormatOutput);
        setStatus('success');
        setShowOutput(true);
        if (animationsEnabled) triggerFireworks();
      } else {
        const formatted = await prettier.format(input, {
          parser: "graphql",
          plugins: [parserGraphql],
        });
        setOutput({ type: 'graphql', data: formatted } as FormatOutput);
        setStatus('success');
        setShowOutput(true);
        if (animationsEnabled) triggerFireworks();
      }
    } catch (err: unknown) {
      setStatus('error');
      setShowOutput(true);
      const errorMessage = err instanceof Error ? err.message : t('errors.invalid_format');
      setError(errorMessage);
    }
  }, [input, activeTab, animationsEnabled, t]);

  const isFormatOutput = (out: FormatOutput | CompareOutput | null): out is FormatOutput => {
    return out !== null && 'type' in out && 'data' in out;
  };

  const handleCompare = useCallback(() => {
    setError(null);
    setStatus('idle');
    setOutput(null);

    if (!input.trim() || !input2.trim()) {
      setStatus('error');
      setError(t('errors.empty_both'));
      return;
    }

    try {
      const json1 = safeJsonParse(input);
      const json2 = safeJsonParse(input2);
      setOutput({ json1, json2 } as CompareOutput);
      setStatus('success');
      setShowOutput(true);
      if (animationsEnabled) triggerFireworks();
    } catch (err: unknown) {
      setStatus('error');
      setShowOutput(true);
      const errorMessage = err instanceof Error ? err.message : t('errors.invalid_json');
      setError(errorMessage);
    }
  }, [input, input2, animationsEnabled, t]);

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

  const renderSamePageLayout = () => (
    <div className="space-y-4">
      <div className="flex justify-center py-4">
        <motion.button
          whileHover={animationsEnabled ? { scale: 1.1, rotate: mode === 'format' ? 90 : 180 } : undefined}
          whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
          onClick={mode === 'format' ? handleProcess : handleCompare}
          style={getGradientStyle()}
          className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl shadow-2xl flex items-center justify-center"
          aria-label={mode === 'format' ? 'Format data' : 'Compare JSONs'}
        >
          {mode === 'format' ? (
            <Zap className="text-white" size={32} />
          ) : (
            <GitCompare className="text-white" size={28} strokeWidth={2.5} />
          )}
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          <InputPanel
            label={mode === 'format' ? t('input.input') : t('input.json1')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClear={() => setInput('')}
            onUpload={(e) => handleFileUpload(e, 'input1')}
            activeTab={mode === 'format' ? activeTab : 'json'}
            placeholder={activeTab === 'json' ? t('input.placeholder_json') : t('input.placeholder_graphql')}
          />
          {mode === 'compare' && (
            <InputPanel
              label={t('input.json2')}
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              onClear={() => setInput2('')}
              onUpload={(e) => handleFileUpload(e, 'input2')}
              activeTab="json"
              placeholder='{\n  "name": "Jane",\n  "age": 25\n}'
              initialX={-10}
            />
          )}
        </div>
        <OutputPanel
          status={status}
          error={error}
          output={output}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCopy={handleCopy}
          onDownload={handleDownload}
          copied={copied}
          mode={mode}
        />
      </div>
    </div>
  );

  const renderDifferentPageLayout = () => {
    if (mode === 'format') {
      return showOutput ? (
        <div className="space-y-4">
          <motion.button
            initial={animationsEnabled ? { x: -20, opacity: 0 } : undefined}
            animate={{ x: 0, opacity: 1 }}
            whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
            onClick={() => setShowOutput(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${themeMode === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            aria-label={t('output.back_to_input')}
          >
            <ArrowLeft size={18} />
            <span>{t('output.back_to_input')}</span>
          </motion.button>
          <OutputPanel
            status={status}
            error={error}
            output={output}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onCopy={handleCopy}
            onDownload={handleDownload}
            copied={copied}
            mode={mode}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center py-4">
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.1, rotate: 90 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
              onClick={handleProcess}
              style={getGradientStyle()}
              className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl shadow-2xl flex items-center justify-center"
              aria-label="Format data"
            >
              <Zap className="text-white" size={32} />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>
          <InputPanel
            label={t('input.input')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClear={() => setInput('')}
            onUpload={(e) => handleFileUpload(e, 'input1')}
            activeTab={activeTab}
            placeholder={activeTab === 'json' ? t('input.placeholder_json') : t('input.placeholder_graphql')}
          />
        </div>
      );
    } else {
      return showOutput ? (
        <div className="space-y-4">
          <motion.button
            initial={animationsEnabled ? { x: -20, opacity: 0 } : undefined}
            animate={{ x: 0, opacity: 1 }}
            whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
            whileTap={animationsEnabled ? { scale: 0.98 } : undefined}
            onClick={() => setShowOutput(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${themeMode === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            aria-label={t('output.back_to_input')}
          >
            <ArrowLeft size={18} />
            <span>{t('output.back_to_input')}</span>
          </motion.button>
          <OutputPanel
            status={status}
            error={error}
            output={output}
            mode={mode}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center py-4">
            <motion.button
              whileHover={animationsEnabled ? { scale: 1.1, rotate: 180 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.9 } : undefined}
              onClick={handleCompare}
              style={getGradientStyle()}
              className="relative group w-16 h-16 lg:w-20 lg:h-20 rounded-2xl shadow-2xl flex items-center justify-center"
              aria-label="Compare JSONs"
            >
              <GitCompare className="text-white" size={28} strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <InputPanel
              label={t('input.json1')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onClear={() => setInput('')}
              onUpload={(e) => handleFileUpload(e, 'input1')}
              activeTab="json"
              placeholder='{\n  "name": "John",\n  "age": 30\n}'
            />
            <InputPanel
              label={t('input.json2')}
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              onClear={() => setInput2('')}
              onUpload={(e) => handleFileUpload(e, 'input2')}
              activeTab="json"
              placeholder='{\n  "name": "Jane",\n  "age": 25\n}'
              initialX={-10}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{
        backgroundColor: themeMode === 'dark' ? '#0a0a0a' : '#f8fafc',
        color: themeMode === 'dark' ? '#f3f4f6' : '#111827'
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${currentTheme.primaryFrom}15, transparent, ${currentTheme.primaryTo}15)`
        }}
      />

      <div className="relative z-10 max-w-[1800px] mx-auto p-3 sm:p-4 md:p-6">
        <Header
          mode={mode}
          setMode={setMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {layoutMode === 'samePage' ? renderSamePageLayout() : renderDifferentPageLayout()}

        <Footer />
      </div>
    </div>
  );
}