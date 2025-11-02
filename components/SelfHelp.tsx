import { useState } from 'react';
import { selfHelpLibrary, getSelfHelpContent, getSelfHelpById } from '@/lib/selfHelpContent';
import { SelfHelpContent } from '@/types';
import { BookOpen, Clock, ArrowLeft, CheckCircle, Circle } from 'lucide-react';

export default function SelfHelp() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<SelfHelpContent | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'prevention', label: 'Prevention' },
    { id: 'relief', label: 'Acute Relief' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'education', label: 'Education' }
  ];

  const filteredContent = selectedCategory === 'all'
    ? selfHelpLibrary
    : getSelfHelpContent(selectedCategory);

  const toggleCompleted = (id: string) => {
    const newCompleted = new Set(completedIds);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedIds(newCompleted);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prevention': return 'bg-green-100 text-green-700';
      case 'relief': return 'bg-red-100 text-red-700';
      case 'lifestyle': return 'bg-blue-100 text-blue-700';
      case 'education': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (selectedContent) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <button
            onClick={() => setSelectedContent(null)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Library
          </button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedContent.category)}`}>
                  {selectedContent.category}
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {selectedContent.duration} min read
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedContent.title}</h1>
              <p className="text-gray-600">{selectedContent.description}</p>
            </div>
            <button
              onClick={() => toggleCompleted(selectedContent.id)}
              className={`ml-4 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                completedIds.has(selectedContent.id)
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {completedIds.has(selectedContent.id) ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>

          <div className="prose max-w-none">
            {selectedContent.content.split('\n').map((line, idx) => {
              // Handle headers
              if (line.startsWith('# ')) {
                return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={idx} className="text-xl font-bold mt-5 mb-2">{line.slice(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
              }

              // Handle bold text
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={idx} className="font-bold mt-3 mb-1">{line.slice(2, -2)}</p>;
              }

              // Handle list items
              if (line.match(/^[\d]+\./)) {
                const text = line.replace(/^[\d]+\.\s*/, '');
                // Check if bold
                if (text.startsWith('**') && text.includes('**:')) {
                  const [bold, rest] = text.split('**:');
                  return (
                    <li key={idx} className="ml-6 mb-2">
                      <strong>{bold.slice(2)}:</strong>{rest}
                    </li>
                  );
                }
                return <li key={idx} className="ml-6 mb-2">{text}</li>;
              }
              if (line.startsWith('- ')) {
                const text = line.slice(2);
                // Check if bold
                if (text.startsWith('**') && text.includes('**:')) {
                  const [bold, rest] = text.split('**:');
                  return (
                    <li key={idx} className="ml-6 mb-2">
                      <strong>{bold.slice(2)}:</strong>{rest}
                    </li>
                  );
                }
                return <li key={idx} className="ml-6 mb-2">{text}</li>;
              }

              // Handle inline bold
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={idx} className="mb-3 leading-relaxed">
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                  </p>
                );
              }

              // Regular paragraph
              if (line.trim()) {
                return <p key={idx} className="mb-3 leading-relaxed">{line}</p>;
              }

              return null;
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => toggleCompleted(selectedContent.id)}
              className={`w-full px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                completedIds.has(selectedContent.id)
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {completedIds.has(selectedContent.id) ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span>Mark as Complete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
        <div className="flex items-center space-x-3 mb-3">
          <BookOpen className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Self-Help Library</h1>
        </div>
        <p className="text-gray-700">
          Evidence-based resources for migraine prevention, relief, and lifestyle management.
        </p>
        <div className="mt-4 p-4 bg-white rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Progress:</strong> {completedIds.size} of {selfHelpLibrary.length} resources completed
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedIds.size / selfHelpLibrary.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredContent.map(content => (
          <div
            key={content.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedContent(content)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(content.category)}`}>
                {content.category}
              </span>
              {completedIds.has(content.id) && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{content.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{content.description}</p>

            <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {content.duration} min read
              </span>
              <span className="text-primary-600 font-medium text-sm hover:text-primary-700">
                Read More →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resources found in this category.</p>
        </div>
      )}
    </div>
  );
}
