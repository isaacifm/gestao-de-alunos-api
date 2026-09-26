import request from 'supertest';
import 'dotenv/config';

const BASE_URL = process.env.URL_BASE || 'http://localhost:3000';

export function api() {
    return request(BASE_URL);
}