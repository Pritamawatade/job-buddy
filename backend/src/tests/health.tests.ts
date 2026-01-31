import request from 'supertest';
import app from '../app';
import { describe, it, expect } from 'vitest';

describe('health check', () => {
    it('should return 200', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
    });
});
