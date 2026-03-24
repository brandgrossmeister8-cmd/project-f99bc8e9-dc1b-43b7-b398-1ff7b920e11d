import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Play } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { history, continueGame } = useGameStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center h-14 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="flex items-center gap-2">
            <span className="text-lg">&#9812;</span>
            <h1 className="font-display font-bold text-foreground">Личный кабинет</h1>
          </div>
        </div>
      </header>

      <div className="container py-6 max-w-2xl">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">История игр</h2>
        {history.length === 0 ? (
          <Card className="chess-card p-8 text-center">
            <div className="text-4xl mb-4 opacity-20">&#9823;</div>
            <p className="text-muted-foreground font-display">Пока нет завершённых игр</p>
            <Button className="mt-4 bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display" onClick={() => navigate('/select')}>Начать игру</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((game, idx) => (
              <Card key={game.id} className={`chess-card p-4 flex items-center justify-between ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <div>
                  <p className="font-display font-medium text-foreground">{game.businessName}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {game.contactPoints.length} точек &middot; {new Date(game.startedAt).toLocaleDateString('ru-RU')}
                  </p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs font-mono">{game.mode === 'solo' ? 'Одиночная' : game.mode === 'custom' ? 'Свой бизнес' : 'Командная'}</Badge>
                    <Badge variant={game.completedAt ? 'default' : 'outline'} className={`text-xs font-mono ${game.completedAt ? 'bg-chess-dark text-chess-light' : ''}`}>
                      {game.completedAt ? 'Завершена' : 'В процессе'}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { continueGame(game.id); navigate('/results'); }} className="gap-1 font-display hover:border-chess-gold">
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
