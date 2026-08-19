export type InterviewRole =
  | 'AWS DevOps Engineer'
  | 'DevOps Engineer'
  | 'Cloud Engineer'
  | 'Site Reliability Engineer'
  | 'Kubernetes Engineer'
  | 'Terraform Engineer'
  | 'AWS Cloud Engineer';

export type ExperienceLevel =
  | '0–2 Years'
  | '2–4 Years'
  | '4–6 Years'
  | '6+ Years';

export type DifficultyLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced';

export interface TopicCategoryGroup {
  category: 'AWS' | 'DevOps' | 'Advanced';
  topics: string[];
}

export const INTERVIEW_TOPICS: TopicCategoryGroup[] = [
  {
    category: 'AWS',
    topics: [
      'EC2',
      'VPC',
      'IAM',
      'S3',
      'RDS',
      'EKS',
      'Lambda',
      'CloudWatch',
      'Route 53',
      'Load Balancer',
    ],
  },
  {
    category: 'DevOps',
    topics: [
      'CI/CD',
      'Jenkins',
      'GitHub Actions',
      'GitLab CI/CD',
      'Docker',
      'Kubernetes',
      'Helm',
      'Terraform',
      'Ansible',
      'Linux',
      'Git',
    ],
  },
  {
    category: 'Advanced',
    topics: [
      'Kubernetes troubleshooting',
      'Terraform state management',
      'AWS architecture',
      'CI/CD architecture',
      'Production incident troubleshooting',
      'High availability',
      'Disaster recovery',
      'Security',
      'Monitoring and observability',
    ],
  },
];

export const INTERVIEW_ROLES: InterviewRole[] = [
  'AWS DevOps Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer',
  'Kubernetes Engineer',
  'Terraform Engineer',
  'AWS Cloud Engineer',
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  '0–2 Years',
  '2–4 Years',
  '4–6 Years',
  '6+ Years',
];

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export interface InterviewConfig {
  role: InterviewRole;
  experience: ExperienceLevel;
  difficulty: DifficultyLevel;
  topic: string;
  totalQuestions: number; // 5 | 10 | 15
  voiceMode: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  isFollowUp?: boolean;
  questionNumber?: number;
}

export interface EvaluationDimension {
  name: string;
  score: number; // 0 to 10
  maxScore: number;
  description: string;
}

export interface InterviewEvaluation {
  overallScore: number; // 0 to 100
  technicalKnowledge: number; // 0 to 10
  problemSolving: number; // 0 to 10
  communication: number; // 0 to 10
  accuracy: number; // 0 to 10
  practicalKnowledge: number; // 0 to 10
  strengths: string[];
  areasForImprovement: string[];
  missingConcepts: string[];
  recommendedTopics: string[];
  interviewReadiness: string;
  finalFeedback: string;
  radarScores?: { subject: string; score: number; fullMark: number }[];
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  durationSeconds: number;
  config: InterviewConfig;
  messages: ChatMessage[];
  currentQuestionIndex: number;
  evaluation?: InterviewEvaluation;
  status: 'idle' | 'active' | 'evaluating' | 'completed';
}
