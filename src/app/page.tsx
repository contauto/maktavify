"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, GitCompare, ArrowLeft, ArrowRightLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import prettier from 'prettier/standalone';
import parserGraphql from 'prettier/parser-graphql';
import { triggerFireworks } from '@/utils/animations';
import { safeJsonParse } from '@/utils/jsonUtils';
import { beautifyXml, xmlToJson, jsonToXml, parseXml } from '@/utils/xmlUtils';
import { useSettings } from '@/context/SettingsContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import InputPanel from '@/components/ui/InputPanel';
import OutputPanel from '@/components/ui/OutputPanel';
import type { Mode, ActiveTab, ViewMode, FormatOutput, CompareOutput, ProcessStatus, ConversionMode, CompareTab } from '@/types';

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
  const [conversionMode, setConversionMode] = useState<ConversionMode>('none');
  const [compareTab, setCompareTab] = useState<CompareTab>('json');

  useEffect(() => {
    setShowOutput(false);
    setOutput(null);
    setError(null);
    setStatus('idle');
  }, [mode]);

  // Reset conversion mode when tab changes
  useEffect(() => {
    setConversionMode('none');
  }, [activeTab]);

  // Reset all state to initial values
  const handleReset = useCallback(() => {
    setMode('format');
    setActiveTab('json');
    setInput('');
    setInput2('');
    setOutput(null);
    setError(null);
    setStatus('idle');
    setViewMode('tree');
    setCopied(false);
    setShowOutput(false);
    setConversionMode('none');
    setCompareTab('json');
  }, []);

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
        // JSON mode - check for conversion
        if (conversionMode === 'jsonToXml') {
          const parsed = safeJsonParse(input);
          const xmlResult = jsonToXml(parsed);
          const beautified = beautifyXml(xmlResult);
          setOutput({ type: 'xml', data: beautified } as FormatOutput);
        } else {
          const parsed = safeJsonParse(input);
          setOutput({ type: 'json', data: parsed } as FormatOutput);
        }
        setStatus('success');
        setShowOutput(true);
        if (animationsEnabled) triggerFireworks();
      } else if (activeTab === 'xml') {
        // XML mode - check for conversion
        if (conversionMode === 'xmlToJson') {
          const jsonResult = xmlToJson(input);
          setOutput({ type: 'json', data: jsonResult } as FormatOutput);
        } else {
          const beautified = beautifyXml(input);
          setOutput({ type: 'xml', data: beautified } as FormatOutput);
        }
        setStatus('success');
        setShowOutput(true);
        if (animationsEnabled) triggerFireworks();
      } else {
        // GraphQL mode
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
  }, [input, activeTab, conversionMode, animationsEnabled, t]);

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
      if (compareTab === 'json') {
        const data1 = safeJsonParse(input);
        const data2 = safeJsonParse(input2);
        setOutput({ compareType: 'json', data1, data2 } as CompareOutput);
      } else if (compareTab === 'graphql') {
        // GraphQL comparison - just validate non-empty
        if (!input.trim() || !input2.trim()) {
          throw new Error(t('errors.empty_both'));
        }
        setOutput({ compareType: 'graphql', data1: input, data2: input2 } as CompareOutput);
      } else {
        // XML comparison - validate both XMLs
        parseXml(input); // throws if invalid
        parseXml(input2); // throws if invalid
        setOutput({ compareType: 'xml', data1: input, data2: input2 } as CompareOutput);
      }
      setStatus('success');
      setShowOutput(true);
      if (animationsEnabled) triggerFireworks();
    } catch (err: unknown) {
      setStatus('error');
      setShowOutput(true);
      const errorMessage = err instanceof Error ? err.message :
        compareTab === 'json' ? t('errors.invalid_json') :
          compareTab === 'xml' ? t('errors.invalid_xml') : t('errors.invalid_graphql');
      setError(errorMessage);
    }
  }, [input, input2, compareTab, animationsEnabled, t]);

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
    const getExtension = (type: string) => {
      switch (type) {
        case 'graphql': return 'graphql';
        case 'xml': return 'xml';
        default: return 'json';
      }
    };
    const ext = getExtension(fileType);
    const exportFileDefaultName = `formatted-${fileType}.${ext}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [output]);

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'json': return t('input.placeholder_json');
      case 'graphql': return t('input.placeholder_graphql');
      case 'xml': return t('input.placeholder_xml');
      default: return '';
    }
  };

  const renderConversionToggle = () => {
    // Only show for JSON and XML tabs in format mode
    if (mode !== 'format') return null;
    if (activeTab !== 'json' && activeTab !== 'xml') return null;

    const options = activeTab === 'json'
      ? [{ value: 'none' as ConversionMode, label: 'JSON' }, { value: 'jsonToXml' as ConversionMode, label: t('header.jsonToXml') }]
      : [{ value: 'none' as ConversionMode, label: 'XML' }, { value: 'xmlToJson' as ConversionMode, label: t('header.xmlToJson') }];

    return (
      <div className="flex justify-center py-2">
        <div className={`p-1 md:p-1.5 rounded-lg md:rounded-xl flex gap-1 md:gap-2 ${themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {options.map((opt) => (
            <motion.button
              key={opt.value}
              whileHover={animationsEnabled ? { scale: 1.05 } : undefined}
              whileTap={animationsEnabled ? { scale: 0.95 } : undefined}
              onClick={() => setConversionMode(opt.value)}
              style={conversionMode === opt.value ? getGradientStyle() : undefined}
              className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${conversionMode === opt.value
                ? 'text-white shadow-lg'
                : themeMode === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                }`}
            >
              {opt.value !== 'none' && <ArrowRightLeft size={14} />}
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>
    );
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

  const renderSamePageLayout = () => (
    <div className="space-y-4">
      {renderConversionToggle()}
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
            placeholder={getPlaceholder()}
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
          {renderConversionToggle()}
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
            placeholder={getPlaceholder()}
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
          compareTab={compareTab}
          setCompareTab={setCompareTab}
          onReset={handleReset}
        />

        {layoutMode === 'samePage' ? renderSamePageLayout() : renderDifferentPageLayout()}

        <Footer />
      </div>
    </div>
  );
}