import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const JoinSession = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState('');

  const handleJoin = () => {
    if (!code.trim()) { toast.error('Введите код сессии'); return; }
    if (!teamName.trim()) { toast.error('Введите название команды'); return; }
    toast.success('Присоединение к сессии... (демо)');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute inset-0 chess-pattern-subtle opacity-20" />
      <Card className="chess-card p-8 w-full max-w-sm mx-4 relative">
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
        <div className="text-3xl mb-4">&#9822;</div>
        <h1 className="text-xl font-display font-bold text-foreground mb-6">Присоединиться к сессии</h1>
        <div className="space-y-4">
          <div>
            <Label className="font-display">Код сессии</Label>
            <Input
              placeholder="ABC123"
              className="text-center font-mono text-lg uppercase tracking-[0.3em]"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <Label className="font-display">Название команды</Label>
            <Input placeholder="Введите название вашей команды" value={teamName} onChange={e => setTeamName(e.target.value)} />
          </div>
          <Button className="w-full gap-2 bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display" onClick={handleJoin}>
            <LogIn className="w-4 h-4" /> Присоединиться
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JoinSession;
