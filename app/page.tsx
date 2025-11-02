'use client';

import { useEffect, useState } from 'react';
import { storageService } from '@/lib/storage';
import { analyticsEngine } from '@/lib/analytics';
import { MigrainEpisode, MigrainePrediction, AnalyticsData } from '@/types';
import Dashboard from '@/components/Dashboard';
import LogEpisode from '@/components/LogEpisode';
import Analytics from '@/components/Analytics';
import SelfHelp from '@/components/SelfHelp';
import History from '@/components/History';
import Navigation from '@/components/Navigation';
import { Activity, BarChart3, BookOpen, Clock, Plus } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'log' | 'analytics' | 'selfhelp' | 'history'>('dashboard');
  const [episodes, setEpisodes] = useState<MigrainEpisode[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [prediction, setPrediction] = useState<MigrainePrediction | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<MigrainEpisode | null>(null);

  useEffect(() => {
    // Initialize demo data on first load
    storageService.initializeDemoData();
    loadData();
  }, []);

  const loadData = () => {
    const loadedEpisodes = storageService.getEpisodes();
    setEpisodes(loadedEpisodes);

    if (loadedEpisodes.length > 0) {
      const analyticsData = analyticsEngine.calculateAnalytics(loadedEpisodes);
      const predictionData = analyticsEngine.predictNextEpisode(loadedEpisodes);
      setAnalytics(analyticsData);
      setPrediction(predictionData);
    }
  };

  const handleSaveEpisode = (episode: MigrainEpisode) => {
    storageService.saveEpisode(episode);
    loadData();
    setEditingEpisode(null);
    setActiveTab('dashboard');
  };

  const handleDeleteEpisode = (id: string) => {
    if (confirm('Are you sure you want to delete this episode?')) {
      storageService.deleteEpisode(id);
      loadData();
    }
  };

  const handleEditEpisode = (episode: MigrainEpisode) => {
    setEditingEpisode(episode);
    setActiveTab('log');
  };

  const handleNewEpisode = () => {
    setEditingEpisode(null);
    setActiveTab('log');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Migraine-Map
                </h1>
                <p className="text-xs text-gray-500">Track, Understand, Prevent</p>
              </div>
            </div>
            <button
              onClick={handleNewEpisode}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Log Episode</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            episodes={episodes}
            analytics={analytics}
            prediction={prediction}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === 'log' && (
          <LogEpisode
            episode={editingEpisode}
            onSave={handleSaveEpisode}
            onCancel={() => {
              setEditingEpisode(null);
              setActiveTab('dashboard');
            }}
          />
        )}
        {activeTab === 'analytics' && analytics && (
          <Analytics
            episodes={episodes}
            analytics={analytics}
            prediction={prediction}
          />
        )}
        {activeTab === 'selfhelp' && (
          <SelfHelp />
        )}
        {activeTab === 'history' && (
          <History
            episodes={episodes}
            onEdit={handleEditEpisode}
            onDelete={handleDeleteEpisode}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Migraine-Map is designed to help you track and manage migraines.</p>
          <p className="mt-1">Always consult healthcare professionals for medical advice.</p>
        </div>
      </footer>
    </div>
  );
}
