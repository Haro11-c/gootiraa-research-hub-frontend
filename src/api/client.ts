import {
  Publication,
  EditorialArticle,
  EditorialCategory,
  AISummaryResult,
  AIAnswerResult,
  AIComparisonResult,
  User,
  AdminStats,
  AuditLog,
} from '../types';

const API_BASE = '/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('gootiraa_token');
  }

  setToken(token: string) {
    localStorage.setItem('gootiraa_token', token);
  }

  clearToken() {
    localStorage.removeItem('gootiraa_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = 'An error occurred';
      try {
        const errorJson = await res.json();
        errorMsg = errorJson.error?.message || errorJson.message || errorMsg;
      } catch (e) {
        errorMsg = res.statusText;
      }
      throw new Error(errorMsg);
    }

    // Check if plain text (for bibtex/ris exports)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/plain')) {
      return (await res.text()) as unknown as T;
    }

    const data = await res.json();
    return data.data !== undefined ? data.data : data;
  }

  // Auth Endpoints
  async register(data: any): Promise<{ user: User; token: string }> {
    const res: any = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async login(data: any): Promise<{ user: User; token: string }> {
    const res: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.token);
    return res;
  }

  async me(): Promise<User & { bookmarkedPublicationIds: string[] }> {
    return this.request('/auth/me');
  }

  async updateProfile(data: any): Promise<any> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getResearcherProfile(id: string): Promise<any> {
    return this.request(`/auth/researcher/${id}`);
  }

  // Publication Endpoints
  async searchPublications(params: Record<string, any> = {}): Promise<{
    publications: Publication[];
    externalResults?: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });

    const res: any = await fetch(`${API_BASE}/publications?${query.toString()}`);
    const json = await res.json();
    return {
      publications: json.data || [],
      externalResults: json.externalData || [],
      meta: json.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }

  async getPublicationById(id: string): Promise<Publication> {
    return this.request(`/publications/${id}`);
  }

  async createPublication(formData: FormData): Promise<Publication> {
    return this.request('/publications', {
      method: 'POST',
      body: formData,
    });
  }

  async exportCitation(id: string, format: 'bibtex' | 'ris' | 'apa' | 'ieee'): Promise<string> {
    const res = await fetch(`${API_BASE}/publications/${id}/export/${format}`);
    if (format === 'bibtex' || format === 'ris') {
      return res.text();
    }
    const json = await res.json();
    return json.citation;
  }

  async toggleBookmark(id: string): Promise<{ bookmarked: boolean }> {
    return this.request(`/publications/${id}/bookmark`, { method: 'POST' });
  }

  // Editorial Endpoints
  async getArticles(params: Record<string, any> = {}): Promise<{ articles: EditorialArticle[]; meta: any }> {
    const query = new URLSearchParams(params as any).toString();
    const res: any = await fetch(`${API_BASE}/editorial/articles?${query}`);
    const json = await res.json();
    return { articles: json.data || [], meta: json.meta };
  }

  async getArticleBySlug(slug: string): Promise<EditorialArticle> {
    return this.request(`/editorial/articles/${slug}`);
  }

  async getCategories(): Promise<EditorialCategory[]> {
    return this.request('/editorial/categories');
  }

  // AI Assistant Endpoints
  async summarizePublication(publicationId: string): Promise<AISummaryResult> {
    return this.request('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ publicationId }),
    });
  }

  async askPublication(publicationId: string, question: string): Promise<AIAnswerResult> {
    return this.request('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ publicationId, question }),
    });
  }

  async comparePublications(publicationId1: string, publicationId2: string): Promise<AIComparisonResult> {
    return this.request('/ai/compare', {
      method: 'POST',
      body: JSON.stringify({ publicationId1, publicationId2 }),
    });
  }

  async explainTerminology(term: string, contextSnippet?: string): Promise<{ term: string; explanation: string; academicContext: string }> {
    return this.request('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ term, contextSnippet }),
    });
  }

  // Community Endpoints
  async getQuestions(publicationId?: string): Promise<any[]> {
    const q = publicationId ? `?publicationId=${publicationId}` : '';
    return this.request(`/community/questions${q}`);
  }

  async askQuestion(data: { title: string; content: string; publicationId?: string }): Promise<any> {
    return this.request('/community/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async answerQuestion(questionId: string, content: string): Promise<any> {
    return this.request(`/community/questions/${questionId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async toggleFollow(researcherId: string): Promise<{ following: boolean }> {
    return this.request(`/community/follow/${researcherId}`, { method: 'POST' });
  }

  async sendCollaborationRequest(data: { receiverId: string; subject: string; message: string }): Promise<any> {
    return this.request('/community/collaborations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Endpoints
  async getAdminStats(): Promise<AdminStats> {
    return this.request('/admin/stats');
  }

  async getPendingSubmissions(): Promise<{ submissions: any[]; meta: any }> {
    const res: any = await this.request('/admin/submissions');
    return { submissions: res, meta: {} };
  }

  async reviewSubmission(id: string, action: 'APPROVED' | 'REJECTED', notes: string): Promise<any> {
    return this.request(`/admin/submissions/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  }

  async getAuditLogs(): Promise<{ logs: AuditLog[]; meta: any }> {
    const res: any = await this.request('/admin/audit-logs');
    return { logs: res, meta: {} };
  }

  async checkHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }
}

export const api = new ApiClient();
