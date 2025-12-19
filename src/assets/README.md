# Assets - Raízes Eventos

## 📁 Estrutura de Pastas

```
src/assets/
├── images/          # Imagens gerais do site
├── logos/           # Logos e marcas
└── README.md        # Este arquivo
```

## 🎨 Paleta de Cores

O projeto usa uma paleta de cores personalizada configurada no Tailwind CSS:

### Cores Primárias (Verde)
- `primary-50` até `primary-950` - Tons de verde para elementos principais
- Uso: botões, links, logo, elementos de destaque

### Cores Secundárias (Amarelo/Dourado)
- `secondary-50` até `secondary-950` - Tons de amarelo/dourado
- Uso: destaques, badges, elementos complementares

### Cores de Acento (Vermelho)
- `accent-50` até `accent-950` - Tons de vermelho
- Uso: alertas, botões de ação crítica, elementos de destaque

### Cores Neutras
- `neutral-50` até `neutral-950` - Tons de cinza
- Uso: textos, bordas, fundos

## 🖼️ Como Inserir uma Logo

### 1. Adicionar arquivo da logo
Coloque seu arquivo de logo (PNG, SVG, JPG) na pasta `src/assets/logos/`

### 2. Usar o componente Logo
```tsx
import Logo from '../components/Logo';

// Logo com texto (padrão)
<Logo />

// Logo apenas (sem texto)
<Logo showText={false} />

// Diferentes tamanhos
<Logo size="sm" />   // Pequeno
<Logo size="md" />   // Médio (padrão)
<Logo size="lg" />   // Grande
<Logo size="xl" />   // Extra grande
```

### 3. Personalizar ainda mais
Se quiser usar sua própria imagem de logo, edite o componente `src/components/Logo.tsx`:

```tsx
// Substitua o círculo com inicial por:
<img 
  src="/src/assets/logos/sua-logo.png" 
  alt="Raízes Eventos" 
  className="w-12 h-12"
/>
```

## 🎯 Exemplos de Uso das Cores

```tsx
// Botão primário
<button className="bg-primary-700 hover:bg-primary-800 text-white">
  Botão Principal
</button>

// Texto secundário
<p className="text-secondary-600">Texto em destaque</p>

// Alerta
<div className="bg-accent-100 text-accent-800 border border-accent-200">
  Mensagem de alerta
</div>

// Texto neutro
<span className="text-neutral-600">Texto secundário</span>
```

## 📝 Notas Importantes

- Todas as cores seguem o sistema de design do Tailwind CSS
- Use sempre as classes de hover para melhor UX
- Mantenha consistência na aplicação das cores
- Teste a acessibilidade das combinações de cores
