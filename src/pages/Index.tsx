import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, User, Briefcase } from 'lucide-react';

const features = [
  { piece: '\u2659', title: 'Найдите слабые места', desc: 'Определите критические точки контакта с клиентами' },
  { piece: '\u2658', title: 'Оцените по 8 критериям', desc: 'Используйте авторскую методологию оценки' },
  { piece: '\u2657', title: 'Получите план', desc: 'Автоматический план спасения бизнеса' },
  { piece: '\u2656', title: 'Играйте в команде', desc: 'Командный режим для тренингов и мастермайндов' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">&#9812;</span>
            <span className="font-display font-bold text-lg text-foreground tracking-wide">Спасти бизнес</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="font-display" onClick={() => navigate('/profile')}>Войти</Button>
            <Button size="sm" className="bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display" onClick={() => navigate('/select')}>Играть</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 chess-pattern-subtle opacity-40" />
        <div className="container py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge variant="secondary" className="mb-6 font-mono text-xs tracking-widest uppercase border border-border">
              &#9823; Бизнес-симулятор
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-black text-foreground mb-6 leading-tight tracking-tight">
              Спасти<br />
              <span className="text-gold-gradient">бизнес</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              Стратегическая игра для предпринимателей. Найдите слабые точки контакта,
              оцените по 8 критериям, составьте план спасения.
            </p>
            <p className="text-sm text-muted-foreground mb-10 font-display italic">
              Методология: Маргарита Осмаева, бренд-гроссмейстер
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gap-2 text-base bg-chess-dark text-chess-light hover:bg-chess-dark/90 font-display" onClick={() => navigate('/select')}>
                <User className="w-4 h-4" /> Играть одному <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base font-display border-chess-dark/20 hover:border-chess-gold hover:text-chess-gold" onClick={() => navigate('/join')}>
                <Users className="w-4 h-4" /> Присоединиться
              </Button>
              <Button size="lg" variant="outline" className="gap-2 text-base font-display border-chess-dark/20 hover:border-chess-gold hover:text-chess-gold" onClick={() => navigate('/host')}>
                <Briefcase className="w-4 h-4" /> Создать сессию
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Card key={i} className="chess-card p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-4xl mb-4 chess-float" style={{ animationDelay: `${i * 0.5}s` }}>{f.piece}</div>
              <h3 className="font-display font-semibold text-foreground mb-1 text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-chess-dark text-chess-light">
        <div className="container py-20">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { piece: '\u2659', step: '1', title: 'Выберите бизнес', desc: 'Из каталога или свой' },
              { piece: '\u2658', step: '2', title: 'Найдите точки', desc: 'Минимум 20 точек контакта' },
              { piece: '\u2657', step: '3', title: 'Оцените', desc: 'По 8 критериям ДА/НЕТ' },
              { piece: '\u2656', step: '4', title: 'План спасения', desc: 'Для ТОП-3 проблем' },
              { piece: '\u2655', step: '5', title: 'Результаты', desc: 'Отчёт и экспорт' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity chess-float" style={{ animationDelay: `${i * 0.3}s` }}>{s.piece}</div>
                <div className="w-8 h-8 border border-chess-gold/40 text-chess-gold font-mono text-sm font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-display font-semibold text-sm">{s.title}</h3>
                <p className="text-xs text-chess-light/50 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-20">
        <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">Тарифы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Бесплатно', price: '0 ₽', piece: '\u2659', features: ['3 бизнеса из каталога', '1 экспорт PDF', 'Базовая история'], cta: 'Начать бесплатно', primary: false },
            { name: 'Платный', price: '990 ₽/мес', piece: '\u2655', features: ['Все бизнесы', 'Режим «Свой бизнес»', 'Командный режим', 'Безлимитный экспорт'], cta: 'Подключить', primary: true },
            { name: 'Корпоративный', price: 'По запросу', piece: '\u2654', features: ['Свои кейсы', 'Аналитика', 'White-label', 'LMS-интеграция'], cta: 'Связаться', primary: false },
          ].map((plan, i) => (
            <Card key={i} className={`p-6 flex flex-col chess-card ${plan.primary ? 'border-chess-gold ring-1 ring-chess-gold/30' : ''}`}>
              <div className="text-2xl mb-2">{plan.piece}</div>
              <h3 className="font-display font-bold text-foreground text-lg">{plan.name}</h3>
              <p className="text-3xl font-display font-black text-foreground mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="text-chess-gold text-xs">&#9670;</span> {f}
                  </li>
                ))}
              </ul>
              <Button className={`mt-6 font-display ${plan.primary ? 'bg-chess-dark text-chess-light hover:bg-chess-dark/90' : ''}`} variant={plan.primary ? 'default' : 'outline'}>{plan.cta}</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-chess-dark text-chess-light/60">
        <div className="container py-10 text-center text-sm">
          <div className="text-2xl mb-3 opacity-30">&#9812;</div>
          <p className="font-display">&copy; 2024 Спасти бизнес. Методология: Маргарита Осмаева</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
