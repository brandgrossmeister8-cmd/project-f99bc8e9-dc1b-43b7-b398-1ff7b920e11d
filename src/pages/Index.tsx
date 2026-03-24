import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, User, Briefcase, Target, BarChart3, FileText, Star } from 'lucide-react';

const features = [
  { icon: Target, title: 'Найдите слабые места', desc: 'Определите критические точки контакта с клиентами' },
  { icon: BarChart3, title: 'Оцените по 8 критериям', desc: 'Используйте авторскую методологию оценки' },
  { icon: FileText, title: 'Получите план', desc: 'Автоматический план спасения бизнеса' },
  { icon: Users, title: 'Играйте в команде', desc: 'Командный режим для тренингов' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-lg text-foreground">Спасти бизнес</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>Войти</Button>
            <Button size="sm" onClick={() => navigate('/select')}>Играть</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <Badge variant="secondary" className="mb-4">Обучающий бизнес-симулятор</Badge>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
            Спасти бизнес
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Интерактивная игра для предпринимателей. Найдите слабые точки контакта с клиентами,
            оцените их по 8 критериям и составьте план спасения.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Методология: <span className="font-semibold text-foreground">Маргарита Осмаева</span>, бренд-гроссмейстер
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="gap-2 text-base" onClick={() => navigate('/select')}>
              <User className="w-4 h-4" /> Играть одному <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base" onClick={() => navigate('/join')}>
              <Users className="w-4 h-4" /> Присоединиться к сессии
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 text-base" onClick={() => navigate('/host')}>
              <Briefcase className="w-4 h-4" /> Создать сессию
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <Card key={i} className="p-6 bg-card hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <f.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card border-y border-border">
        <div className="container py-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Выберите бизнес', desc: 'Из каталога или свой' },
              { step: '2', title: 'Найдите точки', desc: 'Минимум 20 точек контакта' },
              { step: '3', title: 'Оцените', desc: 'По 8 критериям ДА/НЕТ' },
              { step: '4', title: 'План спасения', desc: 'Для ТОП-3 проблем' },
              { step: '5', title: 'Результаты', desc: 'Отчёт и экспорт' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-semibold text-foreground text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">Тарифы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Бесплатно', price: '0 ₽', features: ['3 бизнеса из каталога', '1 экспорт PDF', 'Базовая история'], cta: 'Начать бесплатно', primary: false },
            { name: 'Платный', price: '990 ₽/мес', features: ['Все бизнесы', 'Режим «Свой бизнес»', 'Командный режим', 'Безлимитный экспорт'], cta: 'Подключить', primary: true },
            { name: 'Корпоративный', price: 'По запросу', features: ['Свои кейсы', 'Аналитика', 'White-label', 'LMS-интеграция'], cta: 'Связаться', primary: false },
          ].map((plan, i) => (
            <Card key={i} className={`p-6 flex flex-col ${plan.primary ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              <h3 className="font-bold text-foreground text-lg">{plan.name}</h3>
              <p className="text-2xl font-black text-foreground mt-2">{plan.price}</p>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Star className="w-3 h-3 text-primary flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6" variant={plan.primary ? 'default' : 'outline'}>{plan.cta}</Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Спасти бизнес. Методология: Маргарита Осмаева</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
