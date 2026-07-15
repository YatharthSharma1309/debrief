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
  status?: string | null
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

export interface BudgetItem {
  label: string
  amount: string
  currency?: string | null
  notes?: string | null
  sources?: BriefSource[]
}

export interface AssumptionItem {
  text: string
  owner?: string | null
  sources?: BriefSource[]
}

export interface MetricItem {
  name: string
  target: string
  owner?: string | null
  sources?: BriefSource[]
}

export interface WorkspaceSummary {
  overview: string
  key_decisions: Array<string | DecisionItem>
  open_questions: Array<string | QuestionItem>
  risks: Array<string | RiskItem>
  important_dates: Array<string | DateItem>
  action_items: Array<string | ActionItem>
  owners?: OwnerItem[]
  budget_items?: Array<string | BudgetItem>
  assumptions?: Array<string | AssumptionItem>
  metrics?: Array<string | MetricItem>
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

export function asBudget(item: string | BudgetItem): BudgetItem {
  return typeof item === 'string' ? { label: item, amount: '' } : item
}

export function asAssumption(item: string | AssumptionItem): AssumptionItem {
  return typeof item === 'string' ? { text: item } : item
}

export function asMetric(item: string | MetricItem): MetricItem {
  return typeof item === 'string' ? { name: item, target: '' } : item
}

export function askPromptFromDecision(item: DecisionItem): string {
  const status = item.status ? ` (status: ${item.status})` : ''
  return `What did we decide about "${item.text}"${status} and why?`
}

export function askPromptFromBudget(item: BudgetItem): string {
  return `What is the approved pricing for ${item.label} (${item.amount})${item.notes ? ` — ${item.notes}` : ''}?`
}

export function askPromptFromAssumption(item: AssumptionItem): string {
  return `Is this still an operating assumption: ${item.text}?`
}

export function askPromptFromMetric(item: MetricItem): string {
  return `What is the target for ${item.name} and are we on track for ${item.target}?`
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
