import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useGameStore } from '@/store/gameStore';
import { CRITERIA, JOURNEY_STAGES, getZoneLabel, getZoneColor, getZoneSymbol, type Zone } from '@/types/game';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';

const Evaluation = () => {
  const navigate = useNavigate();
  const { currentGame, setScore, setStage } = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterZone, setFilterZone] = useState<Zone | 'all'>('all');
  const [filterStage] = useState<string>('all');

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

  const handleNext = () => {
    setStage('rescue');
    navigate('/rescue');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setStage('collect'); navigate('/play'); }}><ArrowLeft className="w-4 h-4" /></Button>
            <div>
              <h1 className="font-display font-bold text-foreground text-sm">Оценка точек контакта</h1>
              <p className="text-xs text-muted-foreground font-mono">Оценено: {evaluatedCount}/{currentGame.contactPoints.length}</p>
            </div>
          </div>
          <Button size="sm" onClick={handleNext} className="gap-1 bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display">
            План спасения <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </header>

      {/* Zone filters */}
      <div className="container py-3 flex flex-wrap gap-2">
        <button onClick={() => setFilterZone('all')} className={`text-xs px-3 py-1.5 border transition-colors font-mono ${filterZone === 'all' ? 'bg-chess-dark text-chess-light border-chess-dark' : 'bg-card text-foreground border-border hover:border-chess-gold'}`}>
          Все ({currentGame.contactPoints.length})
        </button>
        {(['red', 'orange', 'yellow', 'green', 'unscored'] as Zone[]).map(z => (
          <button key={z} onClick={() => setFilterZone(z)} className={`text-xs px-3 py-1.5 border transition-colors font-mono flex items-center gap-1.5 ${filterZone === z ? 'ring-1 ring-chess-gold border-chess-gold' : 'border-border hover:border-chess-gold'}`}>
            <span>{getZoneSymbol(z)}</span>
            {getZoneLabel(z)} ({zoneCounts[z]})
          </button>
        ))}
      </div>

      <div className="flex-1 container pb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Points list */}
        <div className="lg:col-span-1 space-y-1 overflow-y-auto max-h-[70vh]">
          {sorted.map((point, idx) => {
            const stageName = JOURNEY_STAGES.find(s => s.id === point.stageId)?.name || '';
            return (
              <Card
                key={point.id}
                className={`p-3 cursor-pointer transition-all hover:border-chess-gold ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'} ${selected?.id === point.id ? 'ring-1 ring-chess-gold border-chess-gold' : ''}`}
                onClick={() => setSelectedId(point.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{point.name}</p>
                    <p className="text-xs text-muted-foreground">{stageName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-foreground">{point.totalScore}/8</span>
                    <span className="text-sm" title={getZoneLabel(point.zone)}>{getZoneSymbol(point.zone)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Evaluation panel */}
        {selected && (
          <div className="lg:col-span-2">
            <Card className="p-6 animate-fade-in chess-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-display font-bold text-foreground">{selected.name}</h2>
                  <p className="text-sm text-muted-foreground">{JOURNEY_STAGES.find(s => s.id === selected.stageId)?.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-display font-black text-foreground">{selected.totalScore}<span className="text-lg text-muted-foreground">/8</span></div>
                  <Badge className="mt-1 font-mono text-xs" style={{
                    backgroundColor: getZoneColor(selected.zone),
                    color: '#fff',
                  }}>
                    {getZoneSymbol(selected.zone)} {getZoneLabel(selected.zone)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {CRITERIA.map((c, idx) => (
                  <div key={c.id} className={`flex items-center justify-between p-3 transition-colors hover:bg-chess-gold-soft ${idx % 2 === 0 ? 'bg-muted/30' : 'bg-card'}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono border-chess-gold/30">{c.code}</Badge>
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.question}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs font-mono text-muted-foreground">{selected.scores[c.id] ? 'ДА' : 'НЕТ'}</span>
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
                <Button variant="outline" size="sm" className="font-display hover:border-chess-gold" onClick={() => {
                  const idx = sorted.findIndex(p => p.id === selected.id);
                  if (idx > 0) setSelectedId(sorted[idx - 1].id);
                }}>&larr; Предыдущая</Button>
                <Button variant="outline" size="sm" className="font-display hover:border-chess-gold" onClick={() => {
                  const idx = sorted.findIndex(p => p.id === selected.id);
                  if (idx < sorted.length - 1) setSelectedId(sorted[idx + 1].id);
                }}>Следующая &rarr;</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluation;
