export interface ConcertGameQuestionView {
  questionId: string;
  imageUrl: string;
  credit: string;
  dateOptions: string[];
  venueOptions: string[];
}

export interface ConcertGameRoundResponse {
  roundToken: string;
  questions: ConcertGameQuestionView[];
}

export interface ConcertGameAnswerResult {
  questionId: string;
  imageUrl: string;
  pickedDate: string;
  pickedVenue: string;
  correctDate: string;
  correctVenue: string;
  dateCorrect: boolean;
  venueCorrect: boolean;
}

export interface ConcertGameSubmitResponse {
  resultId: string;
  score: number;
  dateCorrectCount: number;
  venueCorrectCount: number;
  results: ConcertGameAnswerResult[];
}

export interface ConcertGameRankingRow {
  rank: number;
  resultId: string;
  nickname: string;
  score: number;
  dateCorrectCount: number;
  venueCorrectCount: number;
  isMe: boolean;
}

export interface ConcertGameResultDetail {
  _id: string;
  nickname: string;
  score: number;
  dateCorrectCount: number;
  venueCorrectCount: number;
  createdAt: string;
}
