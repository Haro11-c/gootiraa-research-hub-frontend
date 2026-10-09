export interface Author {
  name: string;
  affiliation?: string;
  orcid?: string;
  role?: string;
  userId?: string;
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
  moderationNote?: string;
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
  submitterId?: string;
  submitter?: {
    id: string;
    email: string;
    role: string;
    profile?: UserProfile;
  };
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
  role: 'USER' | 'RESEARCHER' | 'EDITOR' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  isVerified: boolean;
  profile?: UserProfile;
  wallet?: Wallet;
  bookmarkedPublicationIds?: string[];
  followingIds?: string[];
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
  finance?: {
    pendingPayoutsCount: number;
    totalCreditsInWallets: number;
  };
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

export interface WalletTransaction {
  id: string;
  amountCredits: number;
  type: string;
  status: string;
  description: string;
  referenceId?: string;
  senderName?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balanceCredits: number;
  totalEarnedCredits: number;
  totalWithdrawnCredits: number;
  payoutChannel?: string;
  payoutAccountNumber?: string;
  payoutAccountName?: string;
  transactions?: WalletTransaction[];
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amountCredits: number;
  amountFiat: number;
  currency: string;
  channel: string;
  accountNumber: string;
  accountName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fraudRiskScore: number;
  fraudFlags?: string[];
  createdAt: string;
  user?: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    profile?: {
      fullName: string;
      academicTitle?: string;
      verifiedStatus?: string;
      institution?: { name: string };
    };
  };
}

export interface ResearchBounty {
  id: string;
  title: string;
  description: string;
  sponsorName: string;
  sponsorLogoUrl?: string;
  rewardCredits: number;
  rewardFiat: number;
  currency: string;
  status: string;
}

