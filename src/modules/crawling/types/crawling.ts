export interface CrawlingRequest {
    url: string;
    formats: CrawlingFormat[];
    jsonSchema?: string;
}

export interface Crawling {
    id: string;
    url: string;
    status: CrawlingStatus;
    formats: CrawlingFormat[];
    jsonSchema?: string;
    result?: CrawlingResult;
    error?: string;
    createdAt: string;
    updatedAt: string;
}

export type CrawlingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type CrawlingFormat = 'json' | 'markdown';

export interface CrawlingResult {
    success: boolean;
    data: {
        markdown?: string;
        metadata?: Record<string, unknown>;
    };
}

export interface CrawlingListResponse {
    data: Crawling[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateCrawlingResponse {
    data: Crawling;
    message: string;
} 