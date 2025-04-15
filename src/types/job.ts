export interface Job {
    id: string;
    language: 'python' | 'javascript';
    code: string
    startTime: number;
    status: 'pending' | 'running' | 'completed' | 'error'
    output?: string;
    linesExecuted: number;
}