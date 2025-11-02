import { useState } from 'react';
import { MigrainEpisode } from '@/types';
import { format } from 'date-fns';
import { Calendar, Clock, Zap, Pill, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryProps {
  episodes: MigrainEpisode[];
  onEdit: (episode: MigrainEpisode) => void;
  onDelete: (id: string) => void;
}

export default function History({ episodes, onEdit, onDelete }: HistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'intensity' | 'duration'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedEpisodes = [...episodes].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = a.startTime.getTime() - b.startTime.getTime();
        break;
      case 'intensity':
        comparison = a.painIntensity - b.painIntensity;
        break;
      case 'duration':
        comparison = (a.duration || 0) - (b.duration || 0);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPainColor = (intensity: number) => {
    if (intensity <= 3) return 'text-green-600 bg-green-50';
    if (intensity <= 6) return 'text-yellow-600 bg-yellow-50';
    if (intensity <= 8) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (episodes.length === 0) {
    return (
      <div className="card text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Episodes Logged</h2>
        <p className="text-gray-600">Start tracking your migraines to view your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Episode History</h1>
            <p className="text-sm text-gray-600 mt-1">{episodes.length} total episodes logged</p>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-field py-1 text-sm"
            >
              <option value="date">Date</option>
              <option value="intensity">Pain Intensity</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary py-1 px-3 text-sm"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      {/* Episodes List */}
      <div className="space-y-4">
        {sortedEpisodes.map(episode => {
          const isExpanded = expandedId === episode.id;
          const painLocationLabels = Object.entries(episode.painLocation)
            .filter(([_, value]) => value)
            .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
            .join(', ');

          const symptomsList = Object.entries(episode.symptoms)
            .filter(([_, value]) => value)
            .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim());

          return (
            <div key={episode.id} className="card hover:shadow-md transition-shadow">
              {/* Episode Summary */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {format(episode.startTime, 'MMM d, yyyy')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPainColor(episode.painIntensity)}`}>
                      Pain: {episode.painIntensity}/10
                    </span>
                    {episode.resolved && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        Resolved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{format(episode.startTime, 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Zap className="w-4 h-4 mr-2" />
                      <span>{episode.duration ? `${Math.round(episode.duration / 60)} hrs` : 'Ongoing'}</span>
                    </div>
                    {episode.medications.length > 0 && (
                      <div className="flex items-center text-gray-600">
                        <Pill className="w-4 h-4 mr-2" />
                        <span>{episode.medications.length} medication(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(episode)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(episode.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleExpanded(episode.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  {/* Pain Location */}
                  {painLocationLabels && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Pain Location</h4>
                      <p className="text-sm text-gray-600 capitalize">{painLocationLabels}</p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {symptomsList.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Symptoms</h4>
                      <div className="flex flex-wrap gap-2">
                        {symptomsList.map(symptom => (
                          <span key={symptom} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {episode.medications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Medications</h4>
                      <div className="space-y-2">
                        {episode.medications.map((med, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{med.name}</p>
                                <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                                <p className="text-sm text-gray-600">
                                  Taken: {format(med.timeTaken, 'h:mm a')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Relief Level</p>
                                <p className="text-lg font-bold text-primary-600">{med.reliefLevel}/10</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Context Factors */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Context Factors (24h before)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Screen Time:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.screenTimeHours}h</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Sleep:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.sleepHours}h</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Stress:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.stressLevel}/10</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Hydration:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.hydrationGlasses} glasses</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Caffeine:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.caffeineIntake} cups</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="text-gray-600">Exercise:</span>
                        <span className="ml-1 font-medium">{episode.contextFactors.exerciseMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {episode.notes && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{episode.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
