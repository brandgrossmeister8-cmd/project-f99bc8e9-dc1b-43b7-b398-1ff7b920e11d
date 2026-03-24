import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useGameStore } from '@/store/gameStore';
import { CRITERIA, JOURNEY_STAGES, getZoneLabel, type Zone, type ContactPoint } from '@/types/game';
import { ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

const zoneStyles: Record<Zone, string> = {
  red: 'bg-zone-red border-zone-red zone-red',
  orange: 'bg-zone-orange border-zone-orange zone-orange',
  yellow: 'bg-zone-yellow border-zone-yellow zone-yellow',
  green: 'bg-zone-green border-zone-green zone-green',
  unscored: 'bg-zone-gray zone-gray',
};

const Evaluation = () => {
  const navigate = useNavigate();
  const { currentGame, setScore, setStage } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterZone, setFilterZone] = useState<Zone | 'all'>('all');
  const [filterStage, setFilterStage] = useState<string>('all');

  const sorted = useMemo(() => {
    if (!currentGame) return [];
    let pts = [...currentGame.contactPoints];
    if (filterZone !== 'all') pts = pts.filter(p => p.zone === filterZone);
    if (filterStage !== 'all') pts = pts.filter(p => p.stageId === filterStage);
    return pts.sort((a, b) => b.totalScore - a.totalScore);
  }, [currentGame?.contactPoints, filterZone, filterStage]);

  const selected = currentGame?.contactPoints.find(p => p.id === selectedId) || sorted[0];
  const evaluatedCount = currentGame?.contactPoints.filter(p => Object.values(p.scores).some(Boolean)).length || 0;

  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = { red: 0, orange: 0, yellow: 0, green: 0, unscored: 0 };
    currentGame?.contactPoints.forEach(p => counts[p.zone]++);
    return counts;
  }, [currentGame?.contactPoints]);

  if (!currentGame) { navigate('/select'); return null; }

  // hooks moved above early return

  const handleNext = () => {
    setStage('rescue');
    navigate('/rescue');
  };

  const zoneCounts = useMemo(() => {
    const counts: Record<string, number> = { red: 0, orange: 0, yellow: 0, green: 0, unscored: 0 };
    currentGame.contactPoints.forEach(p => counts[p.zone]++);
    return counts;
  }, [currentGame.contactPoints]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setStage('collect'); navigate('/play'); }}><ArrowLeft className="w-4 h-4" /></Button>
            <div>
              <h1 className="font-bold text-foreground text-sm">Оценка точек контакта</h1>
              <p className="text-xs text-muted-foreground">Оценено: {evaluatedCount}/{currentGame.contactPoints.length}</p>
            </div>
          </div>
          <Button size="sm" onClick={handleNext} className="gap-1">
            План спасения <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </header>

      {/* Zone summary */}
      <div className="container py-3 flex flex-wrap gap-2">
        <button onClick={() => setFilterZone('all')} className={`text-xs px-2 py-1 rounded-full border transition-colors ${filterZone === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border-border'}`}>
          Все ({currentGame.contactPoints.length})
        </button>
        {(['red', 'orange', 'yellow', 'green', 'unscored'] as Zone[]).map(z => (
          <button key={z} onClick={() => setFilterZone(z)} className={`text-xs px-2 py-1 rounded-full border transition-colors ${zoneStyles[z]} ${filterZone === z ? 'ring-2 ring-ring' : ''}`}>
            {getZoneLabel(z)} ({zoneCounts[z]})
          </button>
        ))}
      </div>

      <div className="flex-1 container pb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Points list */}
        <div className="lg:col-span-1 space-y-1 overflow-y-auto max-h-[70vh]">
          {sorted.map(point => {
            const stageName = JOURNEY_STAGES.find(s => s.id === point.stageId)?.name || '';
            return (
              <Card
                key={point.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${selected?.id === point.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedId(point.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{point.name}</p>
                    <p className="text-xs text-muted-foreground">{stageName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-foreground">{point.totalScore}/8</span>
                    <div className={`w-3 h-3 rounded-full ${point.zone === 'red' ? 'bg-zone-red' : point.zone === 'orange' ? 'bg-zone-orange' : point.zone === 'yellow' ? 'bg-zone-yellow' : point.zone === 'green' ? 'bg-zone-green' : 'bg-zone-gray'}`}
                      style={{ backgroundColor: point.zone === 'red' ? '#DC3545' : point.zone === 'orange' ? '#FD7E14' : point.zone === 'yellow' ? '#FFC107' : point.zone === 'green' ? '#28A745' : '#9CA3AF' }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Evaluation panel */}
        {selected && (
          <div className="lg:col-span-2">
            <Card className="p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{JOURNEY_STAGES.find(s => s.id === selected.stageId)?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-foreground">{selected.totalScore}<span className="text-lg text-muted-foreground">/8</span></div>
                  <Badge className={`mt-1 ${selected.zone === 'unscored' ? '' : ''}`} style={{
                    backgroundColor: selected.zone === 'red' ? '#DC3545' : selected.zone === 'orange' ? '#FD7E14' : selected.zone === 'yellow' ? '#FFC107' : selected.zone === 'green' ? '#28A745' : '#9CA3AF',
                    color: selected.zone === 'yellow' ? '#000' : '#fff',
                  }}>
                    {getZoneLabel(selected.zone)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {CRITERIA.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">{c.code}</Badge>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.question}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-muted-foreground">{selected.scores[c.id] ? 'ДА' : 'НЕТ'}</span>
                      <Switch
                        checked={selected.scores[c.id] || false}
                        onCheckedChange={val => setScore(selected.id, c.id, val)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigate between points */}
              <div className="flex justify-between mt-6">
                <Button variant="outline" size="sm" onClick={() => {
                  const idx = sorted.findIndex(p => p.id === selected.id);
                  if (idx > 0) setSelectedId(sorted[idx - 1].id);
                }}>← Предыдущая</Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const idx = sorted.findIndex(p => p.id === selected.id);
                  if (idx < sorted.length - 1) setSelectedId(sorted[idx + 1].id);
                }}>Следующая →</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
