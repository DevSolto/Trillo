import type { HttpClient } from '@/services/http-client';

export class TaskService {
  constructor(private readonly httpClient: HttpClient) {}

  async updateTask(id: string, body: Record<string, unknown>): Promise<void> {
    await this.httpClient.requestVoid(`/task/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  }
}
