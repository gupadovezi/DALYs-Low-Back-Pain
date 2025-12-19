
export interface SlideContent {
  id: string;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  imagePrompt?: string;
  chartType?: 'bar' | 'pie' | 'line' | 'none';
  chartData?: any[];
  footer?: string;
}

export interface PresentationData {
  slides: SlideContent[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  VIEWING = 'VIEWING',
  ERROR = 'ERROR'
}
