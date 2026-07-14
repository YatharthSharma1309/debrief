export interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name?: string
}

export interface LoginPayload {
  email: string
  password: string
}

import { apiRequest } from './client'

export async function registerUser(payload: RegisterPayload): Promise<User> {
  return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export async function loginUser(payload: LoginPayload): Promise<AuthToken> {
  return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export async function getCurrentUser(token: string): Promise<User> {
  return apiRequest('/auth/me', { method: 'GET' }, token)
}
