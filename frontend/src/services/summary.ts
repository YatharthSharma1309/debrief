import { apiRequest } from './client'

export interface BriefSource {
  filename: string
  page_number?: number | null
}

export interface DecisionItem {
  text: string
  rationale?: string | null
  owner?: string | null
  confidence?: string | null
  sources?: BriefSource[]
}

export interface QuestionItem {
  text: string
  owner?: string | null
  sources?: BriefSource[]
}

export interface RiskItem {
  text: string
  severity?: string | null
  type?: string | null
  risk_type?: string | null
  sources?: BriefSource[]
}

export interface DateItem {
  label: string
  date?: string | null
  conflict_with?: string | null
  sources?: BriefSource[]
}

export interface ActionItem {
  text: string
  owner?: string | null
  due_date?: string | null
  status?: string | null
  sources?: BriefSource[]
}

export interface OwnerItem {
  name: string
  owns?: string[]
}

export interface WorkspaceSummary {
  overview: string
  key_decisions: Array<string | DecisionItem>
  open_questions: Array<string | QuestionItem>
  risks: Array<string | RiskItem>
  important_dates: Array<string | DateItem>
  action_items: Array<string | ActionItem>
  owners?: OwnerItem[]
  suggested_questions: string[]
  generated_at?: string | null
}

export function asDecision(item: string | DecisionItem): DecisionItem {
  return typeof item === 'string' ? { text: item } : item
}

export function asQuestion(item: string | QuestionItem): QuestionItem {
  return typeof item === 'string' ? { text: item } : item
}

export function asRisk(item: string | RiskItem): RiskItem {
  return typeof item === 'string' ? { text: item } : item
}

export function asDate(item: string | DateItem): DateItem {
  return typeof item === 'string' ? { label: item } : item
}

export function asAction(item: string | ActionItem): ActionItem {
  return typeof item === 'string' ? { text: item } : item
}

export function askPromptFromDecision(item: DecisionItem): string {
  return `What did we decide about "${item.text}" and why?`
}

export function askPromptFromRisk(item: RiskItem): string {
  return `Explain this risk and any contradictions: ${item.text}`
}

export function askPromptFromDate(item: DateItem): string {
  const dateBit = item.date ? ` (${item.date})` : ''
  return `What is the status of ${item.label}${dateBit}?`
}

export function askPromptFromAction(item: ActionItem): string {
  return `What is the status of this action item: ${item.text}?`
}

export function askPromptFromQuestion(item: QuestionItem): string {
  return item.text
}

export function getWorkspaceSummary(
  token: string,
  workspaceId: string,
): Promise<WorkspaceSummary> {
  return apiRequest(`/workspaces/${workspaceId}/summary`, { method: 'GET' }, token)
}

export function generateWorkspaceSummary(
  token: string,
  workspaceId: string,
): Promise<WorkspaceSummary> {
  return apiRequest(`/workspaces/${workspaceId}/summary`, { method: 'POST' }, token)
}

export function getSuggestedQuestions(
  token: string,
  workspaceId: string,
): Promise<{ questions: string[] }> {
  return apiRequest(`/workspaces/${workspaceId}/suggested-questions`, { method: 'GET' }, token)
}
