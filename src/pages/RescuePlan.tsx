import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/gameStore';
import { getTop3Critical, getZoneLabel, getZoneColor, getZoneSymbol, JOURNEY_STAGES } from '@/types/game';
import { BUSINESSES } from '@/data/businesses';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

const RescuePlan = () => {
  const navigate = useNavigate();
  const { currentGame, updateRescuePlan, setStage, completeGame } = useGameStore();

  const top3 = useMemo(() => currentGame ? getTop3Critical(currentGame.contactPoints) : [], [currentGame?.contactPoints]);

  const [plans, setPlans] = useState(
    top3.map(p => ({
      pointId: p.id,
      problem: '',
      solution: '',
      deadline: '',
      responsible: '',
    }))
  );

  useEffect(() => {
    if (currentGame?.rescuePlan.length) {
      setPlans(currentGame.rescuePlan);
    }
  }, []);

  const business = useMemo(() => currentGame?.businessId ? BUSINESSES.find(b => b.id === currentGame.businessId) : null, [currentGame?.businessId]);

  if (!currentGame) { navigate('/select'); return null; }

  const handleFinish = () => {
    updateRescuePlan(plans);
    completeGame();
    navigate('/results');
  };

  const updatePlan = (idx: number, field: string, value: string) => {
    setPlans(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const chessPieces = ['\u265A', '\u265B', '\u265C'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setStage('evaluate'); navigate('/evaluate'); }}><ArrowLeft className="w-4 h-4" /></Button>
            <div className="flex items-center gap-2">
              <span className="text-lg">&#9813;</span>
              <h1 className="font-display font-bold text-foreground text-sm">План спасения</h1>
            </div>
          </div>
          <Button size="sm" onClick={handleFinish} className="gap-1 bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display">
            Результаты <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </header>

      <div className="container py-6 max-w-3xl space-y-4">
        <p className="text-sm text-muted-foreground font-display">
          Составьте план действий для {top3.length} самых критичных точек контакта
        </p>

        {top3.map((point, idx) => {
          const stageName = JOURNEY_STAGES.find(s => s.id === point.stageId)?.name || '';
          const sampleSolution = business?.sampleSolutions[point.name];

          return (
            <Card key={point.id} className="chess-card p-5 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chessPieces[idx]}</span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{point.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{stageName} &middot; {point.totalScore}/8 баллов</p>
                  </div>
                </div>
                <Badge className="font-mono text-xs" style={{
                  backgroundColor: getZoneColor(point.zone),
                  color: '#fff',
                }}>{getZoneSymbol(point.zone)} {getZoneLabel(point.zone)}</Badge>
              </div>

              {sampleSolution && (
                <div className="flex items-start gap-2 p-3 border border-chess-gold/30 bg-chess-gold-soft mb-4">
                  <Lightbulb className="w-4 h-4 text-chess-gold flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">{sampleSolution}</p>
                </div>
              )}

              <div className="grid gap-3">
                <div>
                  <Label className="text-xs font-display">Проблема</Label>
                  <Textarea className="text-sm" placeholder="Опишите проблему..." value={plans[idx]?.problem || ''} onChange={e => updatePlan(idx, 'problem', e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-display">Решение</Label>
                  <Textarea className="text-sm" placeholder="Что нужно сделать?" value={plans[idx]?.solution || ''} onChange={e => updatePlan(idx, 'solution', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-display">Срок</Label>
                    <Input type="date" className="text-sm" value={plans[idx]?.deadline || ''} onChange={e => updatePlan(idx, 'deadline', e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs font-display">Ответственный</Label>
                    <Input className="text-sm" placeholder="Кто отвечает?" value={plans[idx]?.responsible || ''} onChange={e => updatePlan(idx, 'responsible', e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RescuePlan;
