import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContactPoint, GameMode, GameRun, GameStage, RescuePlanItem, calculateZone, CRITERIA } from '@/types/game';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

interface GameState {
  currentGame: GameRun | null;
  history: GameRun[];
  startGame: (mode: GameMode, businessId: string | null, businessName: string, businessProblem: string, customBusiness?: GameRun['customBusiness']) => void;
  setStage: (stage: GameStage) => void;
  addContactPoint: (name: string, stageId: string) => void;
  removeContactPoint: (id: string) => void;
  moveContactPoint: (id: string, newStageId: string) => void;
  setScore: (pointId: string, criterionId: string, value: boolean) => void;
  updateRescuePlan: (items: RescuePlanItem[]) => void;
  completeGame: () => void;
  resetGame: () => void;
  continueGame: (id: string) => void;
}

function recalcPoint(point: ContactPoint): ContactPoint {
  const totalScore = Object.values(point.scores).filter(Boolean).length;
  return { ...point, totalScore, zone: calculateZone(totalScore) };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentGame: null,
      history: [],

      startGame: (mode, businessId, businessName, businessProblem, customBusiness) => {
        const game: GameRun = {
          id: generateId(),
          mode,
          businessId,
          businessName,
          businessProblem,
          stage: 'collect',
          contactPoints: [],
          rescuePlan: [],
          startedAt: new Date().toISOString(),
          completedAt: null,
          customBusiness,
        };
        set({ currentGame: game });
      },

      setStage: (stage) => {
        const { currentGame } = get();
        if (!currentGame) return;
        set({ currentGame: { ...currentGame, stage } });
      },

      addContactPoint: (name, stageId) => {
        const { currentGame } = get();
        if (!currentGame) return;
        const scores: Record<string, boolean> = {};
        CRITERIA.forEach(c => { scores[c.id] = false; });
        const point: ContactPoint = { id: generateId(), name, stageId, scores, totalScore: 0, zone: 'unscored' };
        set({ currentGame: { ...currentGame, contactPoints: [...currentGame.contactPoints, point] } });
      },

      removeContactPoint: (id) => {
        const { currentGame } = get();
        if (!currentGame) return;
        set({ currentGame: { ...currentGame, contactPoints: currentGame.contactPoints.filter(p => p.id !== id) } });
      },

      moveContactPoint: (id, newStageId) => {
        const { currentGame } = get();
        if (!currentGame) return;
        set({
          currentGame: {
            ...currentGame,
            contactPoints: currentGame.contactPoints.map(p => p.id === id ? { ...p, stageId: newStageId } : p),
          },
        });
      },

      setScore: (pointId, criterionId, value) => {
        const { currentGame } = get();
        if (!currentGame) return;
        set({
          currentGame: {
            ...currentGame,
            contactPoints: currentGame.contactPoints.map(p =>
              p.id === pointId ? recalcPoint({ ...p, scores: { ...p.scores, [criterionId]: value } }) : p
            ),
          },
        });
      },

      updateRescuePlan: (items) => {
        const { currentGame } = get();
        if (!currentGame) return;
        set({ currentGame: { ...currentGame, rescuePlan: items } });
      },

      completeGame: () => {
        const { currentGame, history } = get();
        if (!currentGame) return;
        const completed = { ...currentGame, completedAt: new Date().toISOString(), stage: 'results' as GameStage };
        set({ currentGame: completed, history: [completed, ...history] });
      },

      resetGame: () => set({ currentGame: null }),

      continueGame: (id) => {
        const { history } = get();
        const game = history.find(g => g.id === id);
        if (game) set({ currentGame: { ...game } });
      },
    }),
    { name: 'save-business-game' }
  )
);
