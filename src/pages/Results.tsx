import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import { getTop3Critical, getZoneLabel, getZoneColor, JOURNEY_STAGES, type Zone } from '@/types/game';
import { Download, RotateCcw, Home, FileText, Table } from 'lucide-react';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ZONE_COLORS: Record<Zone, string> = {
  red: '#DC3545',
  orange: '#FD7E14',
  yellow: '#FFC107',
  green: '#28A745',
  unscored: '#9CA3AF',
};

const ZONE_LABELS: Record<Zone, string> = {
  red: 'Красная',
  orange: 'Оранжевая',
  yellow: 'Жёлтая',
  green: 'Зелёная',
  unscored: 'Не оценено',
};

const Results = () => {
  const navigate = useNavigate();
  const { currentGame, resetGame } = useGameStore();

  const top3 = useMemo(() => currentGame ? getTop3Critical(currentGame.contactPoints) : [], [currentGame?.contactPoints]);

  const zoneCounts = useMemo(() => {
    if (!currentGame) return [];
    const counts: Record<Zone, number> = { red: 0, orange: 0, yellow: 0, green: 0, unscored: 0 };
    currentGame.contactPoints.forEach(p => counts[p.zone]++);
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([zone, count]) => ({ name: ZONE_LABELS[zone as Zone], value: count, fill: ZONE_COLORS[zone as Zone] }));
  }, [currentGame?.contactPoints]);

  const stageData = useMemo(() => {
    if (!currentGame) return [];
    return JOURNEY_STAGES.map(s => {
      const pts = currentGame.contactPoints.filter(p => p.stageId === s.id);
      const avg = pts.length ? pts.reduce((sum, p) => sum + p.totalScore, 0) / pts.length : 0;
      return { name: s.name, points: pts.length, avgScore: Math.round(avg * 10) / 10 };
    }),
    [currentGame.contactPoints]
  );

  const handlePlayAgain = () => { resetGame(); navigate('/select'); };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <h1 className="font-bold text-foreground">Результаты</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="gap-1"><Home className="w-3 h-3" /> Главная</Button>
            <Button size="sm" onClick={handlePlayAgain} className="gap-1"><RotateCcw className="w-3 h-3" /> Играть снова</Button>
          </div>
        </div>
      </header>

      <div className="container py-6 space-y-6 max-w-5xl">
        {/* Business info */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground">{currentGame.businessName}</h2>
          <p className="text-sm text-muted-foreground mt-1">{currentGame.businessProblem}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant="secondary">{currentGame.contactPoints.length} точек контакта</Badge>
            <Badge variant="secondary">{currentGame.mode === 'solo' ? 'Одиночная игра' : currentGame.mode === 'team' ? 'Командная' : 'Свой бизнес'}</Badge>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Распределение по зонам</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={zoneCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {zoneCounts.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">По этапам пути клиента</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stageData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="points" fill="hsl(220, 70%, 50%)" name="Точек" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" fill="hsl(354, 70%, 54%)" name="Ср. балл" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top 3 */}
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">ТОП-3 критичных точки</h3>
          <div className="space-y-3">
            {top3.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: getZoneColor(p.zone), color: '#fff' }}>{i + 1}</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{JOURNEY_STAGES.find(s => s.id === p.stageId)?.name} · {p.totalScore}/8</p>
                </div>
                <Badge style={{ backgroundColor: getZoneColor(p.zone), color: p.zone === 'yellow' ? '#000' : '#fff' }}>
                  {getZoneLabel(p.zone)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Rescue plan */}
        {currentGame.rescuePlan.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">План спасения</h3>
            <div className="space-y-4">
              {currentGame.rescuePlan.map((item, i) => {
                const point = currentGame.contactPoints.find(p => p.id === item.pointId);
                return (
                  <div key={i} className="p-4 rounded-lg border border-border">
                    <p className="font-medium text-foreground text-sm">{point?.name || 'Точка контакта'}</p>
                    {item.problem && <p className="text-xs text-muted-foreground mt-1"><strong>Проблема:</strong> {item.problem}</p>}
                    {item.solution && <p className="text-xs text-foreground mt-1"><strong>Решение:</strong> {item.solution}</p>}
                    <div className="flex gap-4 mt-2">
                      {item.deadline && <span className="text-xs text-muted-foreground">📅 {item.deadline}</span>}
                      {item.responsible && <span className="text-xs text-muted-foreground">👤 {item.responsible}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* All points table */}
        <Card className="p-6 overflow-x-auto">
          <h3 className="font-semibold text-foreground mb-4">Все точки контакта</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Точка</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Этап</th>
                <th className="text-center py-2 text-muted-foreground font-medium">Балл</th>
                <th className="text-center py-2 text-muted-foreground font-medium">Зона</th>
              </tr>
            </thead>
            <tbody>
              {[...currentGame.contactPoints].sort((a, b) => b.totalScore - a.totalScore).map(p => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="py-2 text-foreground">{p.name}</td>
                  <td className="py-2 text-muted-foreground">{JOURNEY_STAGES.find(s => s.id === p.stageId)?.name}</td>
                  <td className="py-2 text-center font-mono font-bold text-foreground">{p.totalScore}/8</td>
                  <td className="py-2 text-center">
                    <Badge className="text-xs" style={{ backgroundColor: getZoneColor(p.zone), color: p.zone === 'yellow' ? '#000' : '#fff' }}>
                      {getZoneLabel(p.zone)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-3 justify-center pb-8">
          <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Скачать PDF</Button>
          <Button variant="outline" className="gap-2"><Table className="w-4 h-4" /> Скачать Excel</Button>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Скачать изображение</Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
