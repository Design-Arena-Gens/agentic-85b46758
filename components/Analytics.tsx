import { MigrainEpisode, MigrainePrediction, AnalyticsData } from '@/types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Zap, AlertTriangle } from 'lucide-react';

interface AnalyticsProps {
  episodes: MigrainEpisode[];
  analytics: AnalyticsData;
  prediction: MigrainePrediction | null;
}

export default function Analytics({ episodes, analytics, prediction }: AnalyticsProps) {
  const COLORS = ['#0ea5e9', '#d946ef', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  const triggerChartData = analytics.mostCommonTriggers.map(t => ({
    name: t.factor.length > 30 ? t.factor.substring(0, 27) + '...' : t.factor,
    score: t.correlationScore
  }));

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 font-medium mb-1">Total Episodes</p>
              <p className="text-3xl font-bold text-primary-900">{analytics.totalEpisodes}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-accent-700 font-medium mb-1">Avg Duration</p>
              <p className="text-3xl font-bold text-accent-900">
                {Math.round(analytics.averageDuration / 60)}
                <span className="text-lg ml-1">hrs</span>
              </p>
            </div>
            <Clock className="w-10 h-10 text-accent-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium mb-1">Avg Pain</p>
              <p className="text-3xl font-bold text-orange-900">
                {analytics.averagePainIntensity.toFixed(1)}
                <span className="text-lg ml-1">/10</span>
              </p>
            </div>
            <Zap className="w-10 h-10 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium mb-1">Risk Level</p>
              <p className="text-2xl font-bold text-red-900 uppercase">
                {prediction?.riskLevel || 'N/A'}
              </p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Trigger Analysis */}
      {analytics.mostCommonTriggers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Identified Trigger Correlations</h2>
          <p className="text-sm text-gray-600 mb-6">
            Factors that appear in 60% or more of your migraine episodes
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={triggerChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis label={{ value: 'Correlation %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="score" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.mostCommonTriggers.map((trigger, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{trigger.factor}</span>
                  <span className="text-primary-600 font-bold">{trigger.correlationScore}%</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{trigger.occurrences}</span> out of {analytics.totalEpisodes} episodes
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                    style={{ width: `${trigger.correlationScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hour of Day */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Time of Day Pattern</h2>
          <p className="text-sm text-gray-600 mb-4">When migraines typically start</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.timePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                />
                <YAxis label={{ value: 'Episodes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Day of Week Pattern</h2>
          <p className="text-sm text-gray-600 mb-4">Which days have more episodes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.dayOfWeekPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#d946ef" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Seasonal Pattern */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Seasonal Pattern</h2>
        <p className="text-sm text-gray-600 mb-4">Monthly distribution of migraine episodes</p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.seasonalPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Episodes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {analytics.seasonalPatterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights & Recommendations */}
      {prediction && (
        <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-primary-200">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-primary-600" />
            Personalized Insights
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${
                      prediction.riskLevel === 'critical' ? 'bg-red-500' :
                      prediction.riskLevel === 'high' ? 'bg-orange-500' :
                      prediction.riskLevel === 'moderate' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">{prediction.probability}%</span>
              </div>
            </div>

            {prediction.triggers.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Active Triggers to Address</h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.triggers.map((trigger, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Action Plan</h3>
              <ul className="space-y-2">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-primary-600 mr-2 font-bold">{idx + 1}.</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Episode Comparison */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Month-over-Month Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">This Month</p>
            <p className="text-5xl font-bold text-gray-900">{analytics.episodesThisMonth}</p>
            <p className="text-sm text-gray-500 mt-2">episodes</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Last Month</p>
            <p className="text-5xl font-bold text-gray-900">{analytics.episodesLastMonth}</p>
            <p className="text-sm text-gray-500 mt-2">episodes</p>
          </div>
        </div>
        {analytics.episodesThisMonth !== analytics.episodesLastMonth && (
          <div className="mt-4 p-4 bg-primary-50 rounded-lg text-center">
            {analytics.episodesThisMonth < analytics.episodesLastMonth ? (
              <p className="text-green-700 font-medium">
                ✓ Great progress! You've reduced episodes by{' '}
                {analytics.episodesLastMonth - analytics.episodesThisMonth} this month
              </p>
            ) : (
              <p className="text-orange-700 font-medium">
                Episodes increased by {analytics.episodesThisMonth - analytics.episodesLastMonth} this month.
                Review your triggers and consider preventive strategies.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
