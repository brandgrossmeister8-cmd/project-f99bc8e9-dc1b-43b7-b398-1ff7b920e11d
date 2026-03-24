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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="p-8 w-full max-w-sm mx-4">
        <Button variant="ghost" size="icon" className="mb-4" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
        <h1 className="text-xl font-bold text-foreground mb-6">Присоединиться к сессии</h1>
        <div className="space-y-4">
          <div>
            <Label>Код сессии</Label>
            <Input
              placeholder="Например: ABC123"
              className="text-center font-mono text-lg uppercase tracking-widest"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <Label>Название команды</Label>
            <Input placeholder="Введите название вашей команды" value={teamName} onChange={e => setTeamName(e.target.value)} />
          </div>
          <Button className="w-full gap-2" onClick={handleJoin}>
            <LogIn className="w-4 h-4" /> Присоединиться
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JoinSession;
