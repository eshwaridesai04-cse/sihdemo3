import React from 'react';
import { useVoice } from '../context/VoiceContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceReaderButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
}

export const VoiceReaderButton: React.FC<VoiceReaderButtonProps> = ({
  textToRead,
  label = 'Listen with Voice',
  className = ''
}) => {
  const { isSpeaking, speak, stopSpeaking, isSupported } = useVoice();

  if (!isSupported) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(textToRead);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isSpeaking
          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
          : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
      } ${className}`}
      title={isSpeaking ? 'Stop Speaking' : 'Listen aloud with Voice Assistant'}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
