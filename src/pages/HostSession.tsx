import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Play, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const HostSession = () => {
  const navigate = useNavigate();
  const [sessionCode] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const [sessionStarted, setSessionStarted] = useState(false);
  const [teams] = useState([
    { name: 'Команда Альфа', members: 3, points: 12, status: 'online' },
    { name: 'Команда Бета', members: 2, points: 8, status: 'online' },
    { name: 'Команда Гамма', members: 4, points: 15, status: 'offline' },
  ]);

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    toast.success('Код скопирован');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
            <h1 className="font-bold text-foreground">Экран ведущего</h1>
          </div>
          {!sessionStarted && <Button size="sm" onClick={() => setSessionStarted(true)} className="gap-1"><Play className="w-3 h-3" /> Начать сессию</Button>}
        </div>
      </header>

      <div className="container py-6 max-w-4xl space-y-6">
        {/* Session code */}
        <Card className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Код сессии</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-black font-mono text-foreground tracking-widest">{sessionCode}</span>
            <Button variant="outline" size="icon" onClick={copyCode}><Copy className="w-4 h-4" /></Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Участники могут присоединиться по этому коду</p>
        </Card>

        {/* Teams */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Команды</h3>
            <Badge variant="secondary">{teams.length} команд</Badge>
          </div>
          <div className="space-y-3">
            {teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground text-sm">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.members} участников · {team.points} точек</p>
                </div>
                <Badge variant={team.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                  {team.status === 'online' ? '🟢 Онлайн' : '⚪ Офлайн'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Controls */}
        {sessionStarted && (
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Управление</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">⏸ Пауза</Button>
              <Button variant="outline" size="sm">⏭ Следующий этап</Button>
              <Button variant="destructive" size="sm">⏹ Завершить</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HostSession;
