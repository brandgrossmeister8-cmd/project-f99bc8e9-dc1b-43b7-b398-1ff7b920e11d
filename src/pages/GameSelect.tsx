import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BUSINESSES } from '@/data/businesses';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Search, Lock, Plus } from 'lucide-react';
import { useState } from 'react';

const GameSelect = () => {
  const navigate = useNavigate();
  const { startGame } = useGameStore();
  const [search, setSearch] = useState('');

  const filtered = BUSINESSES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (b: typeof BUSINESSES[0]) => {
    if (!b.isFree) return;
    startGame('solo', b.id, b.name, b.problem);
    navigate('/play');
  };

  const handleCustom = () => {
    navigate('/custom-business');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center h-14 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="flex items-center gap-2">
            <span className="text-lg">&#9812;</span>
            <h1 className="font-display font-bold text-foreground">Выберите бизнес</h1>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Поиск по названию или категории..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" className="gap-2 font-display border-chess-dark/20 hover:border-chess-gold" onClick={handleCustom}>
            <Plus className="w-4 h-4" /> Свой бизнес
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b, i) => (
            <Card
              key={b.id}
              className={`chess-card p-5 cursor-pointer animate-fade-in relative ${!b.isFree ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => handleSelect(b)}
            >
              {!b.isFree && (
                <div className="absolute top-3 right-3">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div className="text-3xl mb-3">{b.emoji}</div>
              <h3 className="font-display font-semibold text-foreground mb-1">{b.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{b.description}</p>
              <Badge className="text-xs bg-chess-dark text-chess-light">{b.problem}</Badge>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs font-mono">{b.category}</Badge>
                {b.isFree && <Badge variant="outline" className="text-xs border-chess-gold/40 text-chess-gold">Бесплатно</Badge>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelect;
