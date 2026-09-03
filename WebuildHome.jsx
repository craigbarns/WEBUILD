import React from 'react';
import { 
  Building, 
  Wrench, 
  Zap, 
  Droplet, 
  Paintbrush, 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Menu,
  ChevronRight
} from 'lucide-react';

export default function WebuildHome() {
  const services = [
    {
      title: "Rénovation complète",
      description: "Appartements, maisons, immeubles, locaux commerciaux et bureaux. Une transformation de A à Z.",
      icon: <Building className="w-8 h-8 text-zinc-900" />
    },
    {
      title: "Gros œuvre & Maçonnerie",
      description: "Démolition, ouvertures, reprises structurelles, planchers, extensions et façades.",
      icon: <Wrench className="w-8 h-8 text-zinc-900" />
    },
    {
      title: "Électricité",
      description: "Rénovation complète, tableaux électriques, mises aux normes, éclairage et réseaux.",
      icon: <Zap className="w-8 h-8 text-zinc-900" />
    },
    {
      title: "Plomberie",
      description: "Création complète, salles de bains, cuisines, évacuations et chauffe-eau.",
      icon: <Droplet className="w-8 h-8 text-zinc-900" />
    },
    {
      title: "Second œuvre",
      description: "Placo, isolation, peinture, sols, carrelage, menuiseries et faux plafonds.",
      icon: <Paintbrush className="w-8 h-8 text-zinc-900" />
    },
    {
      title: "Projets Investisseurs",
      description: "Rénovation d'immeubles et d'appartements ciblée pour le rendement et la division.",
      icon: <Briefcase className="w-8 h-8 text-zinc-900" />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-yellow-200">
      
      {/* NAVIGATION */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-white"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight">WEBUILD</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#expertises" className="text-zinc-600 hover:text-zinc-900 transition-colors">Expertises</a>
            <a href="#investisseurs" className="text-zinc-600 hover:text-zinc-900 transition-colors">Investisseurs</a>
            <a href="#realisations" className="text-zinc-600 hover:text-zinc-900 transition-colors">Réalisations</a>
            <a href="#contact" className="text-zinc-600 hover:text-zinc-900 transition-colors">À propos</a>
          </div>

          <div className="hidden md:block">
            <button className="bg-zinc-900 text-white px-6 py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors">
              Demander un devis
            </button>
          </div>
          
          <button className="md:hidden text-zinc-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          <span className="text-zinc-500 font-semibold tracking-wider uppercase text-xs md:text-sm mb-6 flex items-center gap-3">
            <div className="w-8 h-[2px] bg-yellow-500"></div>
            Entreprise générale de bâtiment à Marseille
          </span>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl mb-8">
            Votre chantier, piloté de A à Z par un <span className="text-zinc-500">interlocuteur unique.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl leading-relaxed mb-10">
            Rénovation complète • Gros œuvre • Électricité • Plomberie • Second œuvre. De la démolition aux finitions, WEBUILD prend en charge votre projet avec une rigueur absolue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-zinc-900 text-white px-8 py-4 font-semibold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
              Demander un devis <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-zinc-200 bg-white text-zinc-900 px-8 py-4 font-semibold hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
              Voir nos réalisations
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section id="expertises" className="py-24 md:py-32 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Un seul partenaire pour l'ensemble de vos travaux.
              </h2>
              <p className="text-lg text-zinc-600">
                Nous structurons notre entreprise pour répondre à toutes les phases de votre projet, évitant ainsi la gestion complexe de multiples artisans.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {services.map((service, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTORS SECTION */}
      <section id="investisseurs" className="py-24 md:py-32 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1 space-y-8">
            <span className="text-yellow-500 font-semibold tracking-wider uppercase text-sm">
              Pôle Professionnels & Investisseurs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Rénovation stratégique pour marchands de biens.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Nous connaissons exactement vos problématiques : budget tendu, planning serré, rentabilité à maximiser, optimisation des surfaces et coordination complexe.
            </p>
            
            <ul className="space-y-4 pt-4">
              {['Chiffrage précis et respect absolu du devis', 'Délais de livraison garantis pour une mise en location rapide', 'Optimisation des m² pour booster votre ROI'].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                  <span className="text-zinc-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="pt-8">
              <button className="bg-white text-zinc-900 px-8 py-4 font-semibold hover:bg-zinc-100 transition-colors">
                Discuter de votre projet
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="aspect-[4/5] bg-zinc-800 rounded-sm overflow-hidden relative">
              {/* Placeholder Image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-700 opacity-50"></div>
              <div className="absolute bottom-8 left-8 right-8 bg-zinc-900/80 backdrop-blur p-6 border border-zinc-700">
                <p className="font-bold text-lg mb-1">Division d'immeuble — Marseille 1er</p>
                <p className="text-zinc-400 text-sm">Création de 4 appartements T2 optimisés.</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-zinc-800 -z-10 hidden md:block"></div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO TEASER */}
      <section id="realisations" className="py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Derniers chantiers livrés</h2>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            La meilleure preuve de notre savoir-faire : nos chantiers. Découvrez la transformation d'espaces à Marseille.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="aspect-video bg-zinc-100 mb-6 relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm z-10">
                  Avant / Après
                </div>
                <div className="absolute inset-0 bg-zinc-200 group-hover:scale-105 transition-transform duration-700"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">Rénovation complète d'un appartement</h3>
              <p className="text-zinc-500 mb-4">Marseille 6e • Surface : 65 m²</p>
              <div className="flex items-center text-sm font-bold gap-2 text-zinc-900">
                Découvrir le projet <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-50 border-t border-zinc-200 py-12 px-6 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl text-zinc-900 tracking-tight">WEBUILD</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-900">Mentions Légales</a>
            <a href="#" className="hover:text-zinc-900">Contact</a>
            <a href="#" className="hover:text-zinc-900">Instagram</a>
          </div>
          <div className="text-zinc-400">© 2024 WEBUILD Marseille. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
}
