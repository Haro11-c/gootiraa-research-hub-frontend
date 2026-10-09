export interface Author {
  name: string;
  affiliation?: string;
  orcid?: string;
}

export interface PublicationFile {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  isPublic: boolean;
}

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  doi?: string;
  arxivId?: string;
  documentType: string;
  reviewStatus: 'PEER_REVIEWED' | 'PREPRINT' | 'UNKNOWN' | 'UNDER_REVIEW';
  publicationYear: number;
  venue?: string;
  publisher?: string;
  license: string;
  isOpenAccess: boolean;
  region: 'GLOBAL' | 'ETHIOPIA' | 'PAN_AFRICA';
  status: string;
  authors: Author[];
  keywords: string[];
  references?: string[];
  metricsViews: number;
  metricsDownloads: number;
  metricsCitations: number;
  metricsBookmarks: number;
  createdAt: string;
  source?: 'INTERNAL' | 'OPENALEX' | 'CROSSREF' | 'ARXIV';
  institution?: {
    id: string;
    name: string;
    city?: string;
    country: string;
  };
  files?: PublicationFile[];
  related?: Partial<Publication>[];
  questions?: Question[];
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  academicTitle?: string;
  bio?: string;
  institution?: {
    id: string;
    name: string;
    country: string;
  };
  department?: string;
  orcidId?: string;
  avatarUrl?: string;
  verifiedStatus: string;
  publicationsCount: number;
  citationCount: number;
  viewsCount: number;
  followersCount: number;
  website?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'RESEARCHER' | 'EDITOR' | 'MODERATOR' | 'ADMIN';
  isVerified: boolean;
  profile?: UserProfile;
}

export interface EditorialCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface FactCheck {
  id: string;
  claim: string;
  claimant: string;
  verdict: 'TRUE' | 'MOSTLY_TRUE' | 'MIXED' | 'MISLEADING' | 'FALSE' | 'UNPROVEN';
  evidenceSummary: string;
  academicSources: { title: string; doi?: string; url?: string }[];
}

export interface CorrectionRecord {
  id: string;
  correctionDate: string;
  explanation: string;
  previousText?: string;
  updatedText?: string;
}

export interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string;
  articleType: 'NEWS' | 'EXPLAINER' | 'INVESTIGATION' | 'FACT_CHECK' | 'INTERVIEW';
  status: string;
  publishedAt: string;
  tags: string[];
  sources: { title: string; url: string; doi?: string }[];
  category: EditorialCategory;
  author: {
    id: string;
    profile?: {
      fullName: string;
      academicTitle?: string;
      avatarUrl?: string;
    };
  };
  factCheck?: FactCheck;
  corrections?: CorrectionRecord[];
  related?: Partial<EditorialArticle>[];
}

export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  user: {
    id: string;
    profile?: {
      fullName: string;
      academicTitle?: string;
      avatarUrl?: string;
    };
  };
  answers?: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  createdAt: string;
  upvotes: number;
  user: {
    id: string;
    profile?: {
      fullName: string;
      academicTitle?: string;
      avatarUrl?: string;
    };
  };
}

export interface GroundedCitation {
  sourceTitle: string;
  doi?: string;
  passage: string;
  confidence: number;
}

export interface AISummaryResult {
  title: string;
  objective: string;
  methodology: string;
  findings: string;
  limitations: string;
  groundedCitations: GroundedCitation[];
  disclaimer: string;
}

export interface AIAnswerResult {
  question: string;
  answer: string;
  isEvidenceSufficient: boolean;
  groundedCitations: GroundedCitation[];
  disclaimer: string;
}

export interface AIComparisonResult {
  paper1: { title: string; objective: string; methodology: string; findings: string };
  paper2: { title: string; objective: string; methodology: string; findings: string };
  similarities: string[];
  differences: string[];
  synthesis: string;
}

export interface AdminStats {
  users: { total: number; researchers: number };
  publications: { published: number; pendingModeration: number };
  editorial: { articles: number };
  moderation: { openReports: number };
  providers: {
    openAlex: { status: string; lastChecked: string };
    crossref: { status: string; lastChecked: string };
    arxiv: { status: string; lastChecked: string };
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress?: string;
  timestamp: string;
  detailsJson?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
