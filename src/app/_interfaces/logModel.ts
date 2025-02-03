export interface LogDetails {
  id: number;
  userInput: string;
  llmResponse: string;
  vectaraScore: number;
  educationScore: number;
  createdAt: Date;
}