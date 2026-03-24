export type Zone = 'red' | 'orange' | 'yellow' | 'green' | 'unscored';

export type GameMode = 'solo' | 'team' | 'custom';
export type GameStage = 'select' | 'collect' | 'evaluate' | 'rescue' | 'results';
export type SessionStatus = 'lobby' | 'collecting_points' | 'scoring' | 'rescue_plan' | 'results' | 'paused' | 'completed';

export interface CustomerJourneyStage {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export const JOURNEY_STAGES: CustomerJourneyStage[] = [
  { id: 'attraction', name: 'Привлечение', description: 'Как клиент узнаёт о вас', icon: '📢', order: 0 },
  { id: 'first_contact', name: 'Первый контакт', description: 'Первое взаимодействие', icon: '👋', order: 1 },
  { id: 'purchase', name: 'Покупка', description: 'Процесс покупки', icon: '💳', order: 2 },
  { id: 'delivery', name: 'Получение', description: 'Получение услуги/продукта', icon: '📦', order: 3 },
  { id: 'return', name: 'Возврат', description: 'Возврат и рекомендация', icon: '🔄', order: 4 },
];

export interface EvaluationCriterion {
  id: string;
  code: string;
  name: string;
  question: string;
}

export const CRITERIA: EvaluationCriterion[] = [
  { id: 'k1', code: 'K1', name: 'Частота', question: 'Клиент сталкивается часто?' },
  { id: 'k2', code: 'K2', name: 'Охват', question: '70%+ клиентов проходят?' },
  { id: 'k3', code: 'K3', name: 'Сарафан', question: 'Расскажут другим при провале?' },
  { id: 'k4', code: 'K4', name: 'Потеря', question: 'Уйдёт к конкуренту?' },
  { id: 'k5', code: 'K5', name: 'Компенсация', question: 'Сложно исправить?' },
  { id: 'k6', code: 'K6', name: 'Преимущество', question: 'Это наша главная фишка?' },
  { id: 'k7', code: 'K7', name: 'Цепная', question: 'Ломает весь путь клиента?' },
  { id: 'k8', code: 'K8', name: 'Юридический', question: 'Возможен штраф/суд?' },
];

export interface ContactPoint {
  id: string;
  name: string;
  stageId: string;
  scores: Record<string, boolean>;
  totalScore: number;
  zone: Zone;
}

export interface RescuePlanItem {
  pointId: string;
  problem: string;
  solution: string;
  deadline: string;
  responsible: string;
}

export interface BusinessTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  problem: string;
  category: string;
  isFree: boolean;
  hints: Record<string, string[]>;
  sampleSolutions: Record<string, string>;
}

export interface GameRun {
  id: string;
  mode: GameMode;
  businessId: string | null;
  businessName: string;
  businessProblem: string;
  stage: GameStage;
  contactPoints: ContactPoint[];
  rescuePlan: RescuePlanItem[];
  startedAt: string;
  completedAt: string | null;
  customBusiness?: {
    name: string;
    niche: string;
    description: string;
    problem: string;
  };
}

export function calculateZone(score: number): Zone {
  if (score >= 7) return 'red';
  if (score >= 5) return 'orange';
  if (score >= 3) return 'yellow';
  if (score >= 1) return 'green';
  return 'unscored';
}

export function getZoneLabel(zone: Zone): string {
  switch (zone) {
    case 'red': return 'Исправлять срочно';
    case 'orange': return 'В этом месяце';
    case 'yellow': return 'Запланировать';
    case 'green': return 'Отложить';
    default: return 'Не оценено';
  }
}

export function getZoneColor(zone: Zone): string {
  switch (zone) {
    case 'red': return '#DC3545';
    case 'orange': return '#FD7E14';
    case 'yellow': return '#FFC107';
    case 'green': return '#28A745';
    default: return '#9CA3AF';
  }
}

export function getTop3Critical(points: ContactPoint[]): ContactPoint[] {
  const red = points.filter(p => p.zone === 'red').sort((a, b) => b.totalScore - a.totalScore);
  const orange = points.filter(p => p.zone === 'orange').sort((a, b) => b.totalScore - a.totalScore);
  const result = [...red];
  if (result.length < 3) result.push(...orange.slice(0, 3 - result.length));
  return result.slice(0, 3);
}
