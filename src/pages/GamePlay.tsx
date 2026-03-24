import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { JOURNEY_STAGES } from '@/types/game';
import { BUSINESSES } from '@/data/businesses';
import { ArrowLeft, ArrowRight, Plus, X, Lightbulb, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

const MIN_POINTS = 20;

const GamePlay = () => {
  const navigate = useNavigate();
  const { currentGame, addContactPoint, removeContactPoint, setStage } = useGameStore();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showHints, setShowHints] = useState<string | null>(null);

  const business = useMemo(() =>
    currentGame?.businessId ? BUSINESSES.find(b => b.id === currentGame.businessId) : null,
    [currentGame?.businessId]
  );

  const pointsByStage = useMemo(() => JOURNEY_STAGES.map(s => ({
    stage: s,
    points: currentGame?.contactPoints.filter(p => p.stageId === s.id) || [],
  })), [currentGame?.contactPoints]);

  const totalPoints = currentGame?.contactPoints.length || 0;
  const canProceed = totalPoints >= MIN_POINTS;

  if (!currentGame) { navigate('/select'); return null; }

  const hints = business?.hints || {};

  const handleAdd = (stageId: string) => {
    const val = inputs[stageId]?.trim();
    if (!val) return;
    addContactPoint(val, stageId);
    setInputs(p => ({ ...p, [stageId]: '' }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, stageId: string) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(stageId); }
  };

  const handleNext = () => {
    if (!canProceed) {
      toast.error(`Нужно минимум ${MIN_POINTS} точек контакта. Найдено: ${totalPoints}`);
      return;
    }
    setStage('evaluate');
    navigate('/evaluate');
  };

  const hints = business?.hints || {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/select')}><ArrowLeft className="w-4 h-4" /></Button>
            <div>
              <h1 className="font-bold text-foreground text-sm">{currentGame.businessName}</h1>
              <p className="text-xs text-muted-foreground">{currentGame.businessProblem}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={canProceed ? 'default' : 'secondary'} className="font-mono">
              {totalPoints}/{MIN_POINTS}
            </Badge>
            <Button size="sm" disabled={!canProceed} onClick={handleNext} className="gap-1">
              Оценить <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container py-4 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-w-[800px] md:min-w-0">
          {pointsByStage.map(({ stage, points }) => (
            <div key={stage.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{stage.icon}</span>
                  <span className="text-xs font-semibold text-foreground">{stage.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs font-mono">{points.length}</Badge>
                  {hints[stage.id] && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowHints(showHints === stage.id ? null : stage.id)}>
                      <Lightbulb className="w-3 h-3 text-zone-yellow" />
                    </Button>
                  )}
                </div>
              </div>

              {showHints === stage.id && hints[stage.id] && (
                <Card className="p-2 mb-2 bg-zone-yellow/50 border-zone-yellow">
                  <p className="text-xs font-semibold text-foreground mb-1">Подсказки:</p>
                  <div className="flex flex-wrap gap-1">
                    {hints[stage.id].map((h, i) => (
                      <button
                        key={i}
                        className="text-xs bg-card px-2 py-0.5 rounded border border-border hover:bg-accent transition-colors text-foreground"
                        onClick={() => { addContactPoint(h, stage.id); toast.success(`Добавлено: ${h}`); }}
                      >
                        + {h}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              <div className="flex gap-1 mb-2">
                <Input
                  placeholder="Точка контакта..."
                  className="text-xs h-8"
                  value={inputs[stage.id] || ''}
                  onChange={e => setInputs(p => ({ ...p, [stage.id]: e.target.value }))}
                  onKeyDown={e => handleKeyDown(e, stage.id)}
                />
                <Button size="icon" variant="outline" className="h-8 w-8 flex-shrink-0" onClick={() => handleAdd(stage.id)}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-1 flex-1 overflow-y-auto max-h-[60vh]">
                {points.map(point => (
                  <Card key={point.id} className="p-2 flex items-center justify-between group animate-scale-in">
                    <span className="text-xs text-foreground truncate flex-1">{point.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeContactPoint(point.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
