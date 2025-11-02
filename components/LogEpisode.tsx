import { useState, useEffect } from 'react';
import { MigrainEpisode, MigrainePainLocation, MigraineSymptomsData, ContextFactors, Medication } from '@/types';
import { Plus, X, Save } from 'lucide-react';

interface LogEpisodeProps {
  episode: MigrainEpisode | null;
  onSave: (episode: MigrainEpisode) => void;
  onCancel: () => void;
}

export default function LogEpisode({ episode, onSave, onCancel }: LogEpisodeProps) {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [painIntensity, setPainIntensity] = useState(5);
  const [painLocation, setPainLocation] = useState<MigrainePainLocation>({
    frontal: false,
    temporal: false,
    parietal: false,
    occipital: false,
    neck: false,
    leftSide: false,
    rightSide: false
  });
  const [symptoms, setSymptoms] = useState<MigraineSymptomsData>({
    aura: false,
    nausea: false,
    vomiting: false,
    lightSensitivity: false,
    soundSensitivity: false,
    smellSensitivity: false,
    visualDisturbances: false,
    dizziness: false
  });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [contextFactors, setContextFactors] = useState<ContextFactors>({
    screenTimeHours: 0,
    workHours: 0,
    drivingHours: 0,
    exerciseMinutes: 0,
    sleepHours: 7,
    sleepQuality: 3,
    stressLevel: 5,
    postureRating: 3,
    neckTension: false,
    environmentalNoise: 3,
    lightExposure: 3,
    weatherPressure: 'normal',
    hydrationGlasses: 8,
    caffeineIntake: 0,
    alcoholIntake: 0,
    mealRegularity: 3
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (episode) {
      setStartTime(episode.startTime);
      setEndTime(episode.endTime || null);
      setPainIntensity(episode.painIntensity);
      setPainLocation(episode.painLocation);
      setSymptoms(episode.symptoms);
      setMedications(episode.medications);
      setContextFactors(episode.contextFactors);
      setNotes(episode.notes || '');
    }
  }, [episode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const duration = endTime ? Math.round((endTime.getTime() - startTime.getTime()) / 60000) : undefined;

    const newEpisode: MigrainEpisode = {
      id: episode?.id || Date.now().toString(),
      startTime,
      endTime: endTime || undefined,
      duration,
      painIntensity,
      painLocation,
      symptoms,
      medications,
      contextFactors,
      notes,
      resolved: !!endTime
    };

    onSave(newEpisode);
  };

  const addMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      timeTaken: new Date(),
      reliefLevel: 0
    }]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Info */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Episode Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date & Time</label>
            <input
              type="datetime-local"
              value={startTime.toISOString().slice(0, 16)}
              onChange={(e) => setStartTime(new Date(e.target.value))}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label">End Date & Time (if resolved)</label>
            <input
              type="datetime-local"
              value={endTime?.toISOString().slice(0, 16) || ''}
              onChange={(e) => setEndTime(e.target.value ? new Date(e.target.value) : null)}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Pain Intensity: {painIntensity}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={painIntensity}
            onChange={(e) => setPainIntensity(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>
      </div>

      {/* Pain Location */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Pain Location</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(painLocation).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setPainLocation({ ...painLocation, [key]: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Symptoms</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(symptoms).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setSymptoms({ ...symptoms, [key]: e.target.checked })}
                className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Medications Taken</h2>
          <button type="button" onClick={addMedication} className="btn-secondary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        {medications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No medications logged</p>
        ) : (
          <div className="space-y-4">
            {medications.map((med, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeMedication(idx)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="label text-xs">Medication Name</label>
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(idx, 'name', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Ibuprofen"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Dosage</label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                      className="input-field"
                      placeholder="e.g., 400mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Time Taken</label>
                    <input
                      type="datetime-local"
                      value={med.timeTaken.toISOString().slice(0, 16)}
                      onChange={(e) => updateMedication(idx, 'timeTaken', new Date(e.target.value))}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs">Relief Level: {med.reliefLevel}/10</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={med.reliefLevel}
                      onChange={(e) => updateMedication(idx, 'reliefLevel', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context Factors */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Context & Triggers (Past 24 Hours)</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Screen Time (hours)</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={contextFactors.screenTimeHours}
                onChange={(e) => setContextFactors({ ...contextFactors, screenTimeHours: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Work Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={contextFactors.workHours}
                onChange={(e) => setContextFactors({ ...contextFactors, workHours: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Sleep Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={contextFactors.sleepHours}
                onChange={(e) => setContextFactors({ ...contextFactors, sleepHours: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Sleep Quality (1-5): {contextFactors.sleepQuality}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={contextFactors.sleepQuality}
                onChange={(e) => setContextFactors({ ...contextFactors, sleepQuality: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Stress Level (1-10): {contextFactors.stressLevel}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={contextFactors.stressLevel}
                onChange={(e) => setContextFactors({ ...contextFactors, stressLevel: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Hydration (glasses)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={contextFactors.hydrationGlasses}
                onChange={(e) => setContextFactors({ ...contextFactors, hydrationGlasses: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Caffeine Intake (cups)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={contextFactors.caffeineIntake}
                onChange={(e) => setContextFactors({ ...contextFactors, caffeineIntake: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Exercise (minutes)</label>
              <input
                type="number"
                min="0"
                max="300"
                step="5"
                value={contextFactors.exerciseMinutes}
                onChange={(e) => setContextFactors({ ...contextFactors, exerciseMinutes: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Light Exposure (1-5): {contextFactors.lightExposure}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={contextFactors.lightExposure}
                onChange={(e) => setContextFactors({ ...contextFactors, lightExposure: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Environmental Noise (1-5): {contextFactors.environmentalNoise}</label>
              <input
                type="range"
                min="1"
                max="5"
                value={contextFactors.environmentalNoise}
                onChange={(e) => setContextFactors({ ...contextFactors, environmentalNoise: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Weather Pressure</label>
              <select
                value={contextFactors.weatherPressure}
                onChange={(e) => setContextFactors({ ...contextFactors, weatherPressure: e.target.value as any })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contextFactors.neckTension}
                  onChange={(e) => setContextFactors({ ...contextFactors, neckTension: e.target.checked })}
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="text-sm font-medium">Neck Tension/Poor Posture</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Additional Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="input-field"
          placeholder="Any additional observations, potential triggers, or context..."
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Save Episode</span>
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary px-8">
          Cancel
        </button>
      </div>
    </form>
  );
}
