
export interface TranscriptionRecord {
  id: string;
  audioUri: string;
  transcription: string;
  timestamp: number;
  duration: number;
  status: 'pending' | 'completed' | 'error';
}

export interface AppSettings {
  apiKey: string;
  apiProvider: 'openai' | 'assemblyai';
}
