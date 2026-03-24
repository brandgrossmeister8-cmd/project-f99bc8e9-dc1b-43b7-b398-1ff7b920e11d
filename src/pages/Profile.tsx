import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Play, Trash2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { history, continueGame } = useGameStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center h-14 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
          <h1 className="font-bold text-foreground">Личный кабинет</h1>
        </div>
      </header>

      <div className="container py-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">История игр</h2>
        {history.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Пока нет завершённых игр</p>
            <Button className="mt-4" onClick={() => navigate('/select')}>Начать игру</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map(game => (
              <Card key={game.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{game.businessName}</p>
                  <p className="text-xs text-muted-foreground">
                    {game.contactPoints.length} точек · {new Date(game.startedAt).toLocaleDateString('ru-RU')}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">{game.mode === 'solo' ? 'Одиночная' : game.mode === 'custom' ? 'Свой бизнес' : 'Командная'}</Badge>
                    <Badge variant={game.completedAt ? 'default' : 'outline'} className="text-xs">{game.completedAt ? 'Завершена' : 'В процессе'}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { continueGame(game.id); navigate('/results'); }} className="gap-1">
                  <Play className="w-3 h-3" /> Открыть
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
