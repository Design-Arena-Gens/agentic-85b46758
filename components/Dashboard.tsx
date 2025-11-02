import { MigrainEpisode, MigrainePrediction, AnalyticsData } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, TrendingDown, TrendingUp, Activity, Calendar, Clock, Zap, BookOpen } from 'lucide-react';

interface DashboardProps {
  episodes: MigrainEpisode[];
  analytics: AnalyticsData | null;
  prediction: MigrainePrediction | null;
  onNavigate: (tab: 'dashboard' | 'log' | 'analytics' | 'selfhelp' | 'history') => void;
}

export default function Dashboard({ episodes, analytics, prediction, onNavigate }: DashboardProps) {
  const recentEpisode = episodes.length > 0 ? episodes[episodes.length - 1] : null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskBorderColor = (level: string) => {
    switch (level) {
      case 'low': return 'border-green-200';
      case 'moderate': return 'border-yellow-200';
      case 'high': return 'border-orange-200';
      case 'critical': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  if (episodes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Migraine-Map</h2>
          <p className="text-gray-600 mb-6">
            Start tracking your migraines to gain insights and reduce episodes
          </p>
          <button
            onClick={() => onNavigate('log')}
            className="btn-primary"
          >
            Log Your First Episode
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary-600" />
              Quick Start
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Log episodes when they occur
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Track triggers and context factors
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Review analytics to find patterns
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Use self-help resources for prevention
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-accent-600" />
              Learn More
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Explore our self-help library to learn evidence-based strategies for migraine management.
            </p>
            <button
              onClick={() => onNavigate('selfhelp')}
              className="btn-secondary w-full"
            >
              Browse Self-Help Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trend = analytics && analytics.episodesThisMonth < analytics.episodesLastMonth ? 'down' : 'up';

  return (
    <div className="space-y-6">
      {/* Prediction Card */}
      {prediction && (
        <div className={`card border-2 ${getRiskBorderColor(prediction.riskLevel)}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Migraine Risk Prediction</h2>
              <p className="text-sm text-gray-600">Based on your history and patterns</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getRiskColor(prediction.riskLevel)}`}>
              {prediction.riskLevel.toUpperCase()}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Risk Probability</span>
              <span className="text-2xl font-bold text-gray-900">{prediction.probability}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  prediction.riskLevel === 'critical' ? 'bg-red-500' :
                  prediction.riskLevel === 'high' ? 'bg-orange-500' :
                  prediction.riskLevel === 'moderate' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${prediction.probability}%` }}
              />
            </div>
          </div>

          {prediction.triggers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Trigger Factors:</h3>
              <div className="flex flex-wrap gap-2">
                {prediction.triggers.map((trigger, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {trigger}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommendations:</h3>
            <ul className="space-y-1">
              {prediction.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-primary-600 mr-2 mt-1">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Episodes</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.totalEpisodes || 0}</p>
            </div>
            <Activity className="w-10 h-10 text-primary-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.episodesThisMonth || 0}</p>
              {analytics && analytics.episodesLastMonth > 0 && (
                <div className="flex items-center mt-1">
                  {trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(analytics.episodesThisMonth - analytics.episodesLastMonth)} vs last month
                  </span>
                </div>
              )}
            </div>
            <Calendar className="w-10 h-10 text-accent-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Duration</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics ? Math.round(analytics.averageDuration / 60) : 0}
                <span className="text-lg text-gray-500 ml-1">hrs</span>
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Pain Intensity</p>
              <p className="text-3xl font-bold text-gray-900">
                {analytics ? analytics.averagePainIntensity.toFixed(1) : 0}
                <span className="text-lg text-gray-500 ml-1">/10</span>
              </p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Recent Episode & Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Episode */}
        {recentEpisode && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Most Recent Episode</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Date & Time</span>
                <span className="text-sm font-medium text-gray-900 text-right">
                  {format(recentEpisode.startTime, 'MMM d, yyyy')}
                  <br />
                  {format(recentEpisode.startTime, 'h:mm a')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  {recentEpisode.duration ? `${Math.round(recentEpisode.duration / 60)} hrs` : 'Ongoing'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pain Intensity</span>
                <span className="text-sm font-medium text-gray-900">{recentEpisode.painIntensity}/10</span>
              </div>
              {recentEpisode.medications.length > 0 && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Medication</span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    {recentEpisode.medications[0].name} ({recentEpisode.medications[0].dosage})
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="btn-secondary w-full mt-4"
            >
              View All Episodes
            </button>
          </div>
        )}

        {/* Top Triggers */}
        {analytics && analytics.mostCommonTriggers.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Top Trigger Factors</h3>
            <div className="space-y-3">
              {analytics.mostCommonTriggers.slice(0, 5).map((trigger, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{trigger.factor}</span>
                    <span className="text-sm font-semibold text-primary-600">
                      {trigger.correlationScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      style={{ width: `${trigger.correlationScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {trigger.occurrences} occurrences
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="btn-secondary w-full mt-4"
            >
              View Detailed Analytics
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('log')}
            className="btn-primary"
          >
            Log New Episode
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="btn-secondary"
          >
            View Analytics
          </button>
          <button
            onClick={() => onNavigate('selfhelp')}
            className="btn-secondary"
          >
            Self-Help Resources
          </button>
        </div>
      </div>
    </div>
  );
}
