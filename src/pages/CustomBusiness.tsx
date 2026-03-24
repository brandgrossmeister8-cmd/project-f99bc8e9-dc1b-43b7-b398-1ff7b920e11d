import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const CustomBusiness = () => {
  const navigate = useNavigate();
  const { startGame } = useGameStore();
  const [form, setForm] = useState({ name: '', niche: '', description: '', problem: '' });

  const canStart = form.name.trim() && form.problem.trim();

  const handleStart = () => {
    if (!canStart) return;
    startGame('custom', null, form.name, form.problem, {
      name: form.name,
      niche: form.niche,
      description: form.description,
      problem: form.problem,
    });
    navigate('/play');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center h-14 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/select')}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="flex items-center gap-2">
            <span className="text-lg">&#9816;</span>
            <h1 className="font-display font-bold text-foreground">Свой бизнес</h1>
          </div>
        </div>
      </header>
      <div className="container py-8 max-w-lg">
        <Card className="chess-card p-6 space-y-4">
          <div>
            <Label className="font-display">Название бизнеса *</Label>
            <Input placeholder="Например: Моя кофейня" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <Label className="font-display">Ниша / Категория</Label>
            <Input placeholder="HoReCa, IT, Образование..." value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} />
          </div>
          <div>
            <Label className="font-display">Описание</Label>
            <Textarea placeholder="Кратко опишите бизнес..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <Label className="font-display">Основная проблема *</Label>
            <Textarea placeholder="Какую проблему хотите решить?" value={form.problem} onChange={e => setForm(p => ({ ...p, problem: e.target.value }))} />
          </div>
          <Button className="w-full bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display" disabled={!canStart} onClick={handleStart}>Начать игру</Button>
        </Card>
      </div>
    </div>
  );
};

export default CustomBusiness;
