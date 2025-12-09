import { create } from 'zustand';

type Language = 'no' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  no: {
    // Navigation
    'nav.home': 'Hjem',
    'nav.portfolio': 'Portefølje',
    'nav.blog': 'Nyheter',
    'nav.courses': 'Kurs',
    'nav.resources': 'Ressurser',
    'nav.products': 'Produkter',
    'nav.community': 'Fellesskap',
    'nav.contact': 'Kontakt',
    
    // Common
    'common.loading': 'Laster...',
    'common.save': 'Lagre',
    'common.cancel': 'Avbryt',
    'common.delete': 'Slett',
    'common.edit': 'Rediger',
    'common.create': 'Opprett',
    'common.search': 'Søk',
    'common.filter': 'Filtrer',
    'common.actions': 'Handlinger',
    'common.close': 'Lukk',
    'common.title': 'Tittel',
    'common.name': 'Navn',
    'common.email': 'E-post',
    'common.phone': 'Telefon',
    'common.optional': 'valgfritt',
    'common.next': 'Neste',
    'common.previous': 'Forrige',
    'common.submit': 'Send',
    'common.of': 'av',
    'common.backToHome': 'Tilbake til hjem',
    
    // Homepage
    'home.title': 'Sebastian Saethre',
    'home.subtitle': '',
    'home.description': 'Gjør AI tilgjengelig, praktisk og revolusjonerende på tvers av bransjer.',
    'home.cta.blog': 'Siste nytt',
    'home.cta.resources': 'Nyttige AI Verktøy',
    'home.cta.courses': 'Gratis kurs',
    'home.cta.community': 'Bli med i fellesskapet',
    'home.cta.onboarding': 'Start AI Onboarding',
    'home.featured.blog': 'Siste nytt',
    'home.featured.blog.desc': 'Utforsk praktiske AI-løsninger, verktøy og innsikter.',
    'home.featured.courses': 'Gratis kurs',
    'home.featured.courses.desc': 'Lær AI på en praktisk måte med gratis kurs.',
    'home.featured.resources': 'AI-verktøy og ressurser',
    'home.featured.resources.desc': 'Oppdag de beste AI-verktøyene og anbefalingene.',
    
    // Footer
    'footer.tagline': '',
    'footer.tagline.desc': 'Gjør AI tilgjengelig og praktisk for alle.',
    'footer.connect': 'Kontakt',
    'footer.quickLinks': 'Hurtiglenker',
    'footer.latestArticles': 'Siste nytt',
    'footer.freeCourses': 'Gratis kurs',
    'footer.joinCommunity': 'Bli med i fellesskapet',
    'footer.getInTouch': 'Kontakt meg',
    'footer.rights': 'Alle rettigheter reservert.',
    'footer.admin': 'Admin',
    
    // Pages
    'portfolio.title': 'Portefølje',
    'portfolio.description': 'Prosjekter og arbeid innen webutvikling, AI-applikasjoner og innholdsproduksjon.',
    'portfolio.comingSoon': 'Prosjekter kommer snart.',
    
    'blog.title': 'Nyheter',
    'blog.description': 'Praktiske AI-innsikter, opplæringer, verktøygjennomganger og bransjeapplikasjoner.',
    'blog.comingSoon': 'Nyheter kommer snart.',
    
    'courses.title': 'Kurs',
    'courses.description': 'Lær AI på en praktisk måte. Gratis og betalte kurs om AI-applikasjoner, programmering og verktøy.',
    'courses.comingSoon': 'Kurs kommer snart.',
    
    'resources.title': 'Ressurser',
    'resources.description': 'Kuraterte AI-verktøy, ressurser og anbefalinger. Finn det som er verdt tiden din.',
    'resources.comingSoon': 'Ressurser kommer snart.',
    'resources.readMore': 'Les mer',
    'resources.visit': 'Besøk',
    'resources.worthIt': 'Verdt det',
    'resources.all': 'Alle',
    'resources.notFound': 'Ressurs ikke funnet',
    'resources.notFoundDesc': 'Ressursen du leter etter finnes ikke.',
    'resources.backToResources': 'Tilbake til ressurser',
    'resources.needHelp': 'Trenger hjelp?',
    
    'community.title': 'Fellesskap',
    'community.description': 'Bli med i fellesskapet - Discord, nyhetsbrev, gratis kurs og mer.',
    'community.comingSoon': 'Fellesskap kommer snart.',
    'community.stayUpdated': 'Hold deg oppdatert',
    'community.newsletterDesc': 'Få ukentlige oppdateringer om AI-verktøy, veiledninger og bransjeinnsikt rett i innboksen din.',
    'community.thankYouSubscribed': 'Takk for at du abonnerte! Sjekk e-posten din for å bekrefte.',
    'community.subscribing': 'Abonnerer...',
    'community.subscribe': 'Abonner',
    'community.enterEmail': 'Skriv inn e-posten din',
    'community.alreadySubscribed': 'Du er allerede abonnert!',
    'community.subscribedLocal': 'Abonnert! (Lagret lokalt)',
    'community.sorryError': 'Beklager, noe gikk galt. Vennligst prøv igjen senere.',
    'community.discordTitle': 'Discord-fellesskap',
    'community.discordDesc': 'Bli med i vår Discord-server for sanntidsdiskusjoner, Q&A-økter og nettverk med andre AI-entusiaster.',
    'community.joinDiscord': 'Bli med i Discord',
    'community.newsletterTitle': 'Nyhetsbrev',
    'community.keepUpdatedTitle': 'Hold deg oppdatert',
    'community.keepUpdatedDesc': 'Følg meg på Twitter og YouTube for de siste oppdateringene, tips og innsikter om AI.',
    'community.exclusiveTitle': 'Eksklusive ressurser',
    'community.exclusiveDesc': 'Få tidlig tilgang til nye verktøy, maler og ressurser før de er offentlig tilgjengelige.',
    'community.learnMore': 'Lær mer',
    'community.readyToJoin': 'Klar til å bli med?',
    'community.joinMessage': 'Start din AI-reise i dag og koble til med et fellesskap av likesinnede personer.',
    'community.getStarted': 'Kom i gang',
    
    'contact.title': 'Kontakt',
    'contact.getInTouch': 'Kontakt meg',
    'contact.description': 'Har du spørsmål eller vil du samarbeide? Send meg en melding, så svarer jeg så raskt jeg kan.',
    
    // Onboarding
    'onboarding.title': 'AI Onboarding',
    'onboarding.step': 'Steg',
    'onboarding.step1.title': 'Hva søker du?',
    'onboarding.step1.personal': 'Personlig bruk',
    'onboarding.step1.professional': 'Profesjonell bruk',
    'onboarding.step2.title': 'Hva er målet ditt?',
    'onboarding.step2.personal.goals': 'Læring, Produktivitet, Kreativitet, Automatisering, Annet',
    'onboarding.step2.professional.goals': 'Markedsføring, Kundeservice, Interne operasjoner, Utdanning, Annet',
    'onboarding.step3.title': 'Hvordan bruker du AI-verktøy nå?',
    'onboarding.step3.placeholder': 'Beskriv hvordan du bruker AI-verktøy i dag, eller hvis du ikke bruker dem ennå...',
    'onboarding.step3.options': 'Jeg bruker ikke AI ennå, Jeg bruker ChatGPT av og til, Jeg bruker AI på jobb, Jeg bruker AI til personlige prosjekter, Jeg er en AI power user',
    'onboarding.step3.elaborate': 'Fortell oss mer (valgfritt)',
    'onboarding.step4.title': 'Hva er din største utfordring?',
    'onboarding.step4.placeholder': 'Beskriv hva du håper AI kan hjelpe deg med...',
    'onboarding.step4.options': 'Jeg vet ikke hvor jeg skal starte, Jeg vil spare tid, Jeg vil være mer kreativ, Jeg vil automatisere oppgaver, Jeg vil lære nye ferdigheter, Jeg vil forbedre arbeidet mitt',
    'onboarding.step4.elaborate': 'Fortell oss mer (valgfritt)',
    'onboarding.step5.title': 'Kontaktinformasjon',
    'onboarding.step5.companyName': 'Firmanavn',
    'onboarding.step5.industry': 'Bransje',
    'onboarding.consent': 'Jeg samtykker til at mine data kan brukes til oppfølging',
    'onboarding.sending': 'Sender...',
    'onboarding.thanks.title': 'Takk for din interesse!',
    'onboarding.thanks.message': 'Vi tar kontakt snart for å diskutere hvordan vi kan hjelpe deg med AI.',
    'onboarding.thanks.calendly': 'Vil du planlegge et møte?',
    'onboarding.thanks.schedule': 'Planlegg et møte her',
    'onboarding.thanks.readInsights': 'Les mine innsikter',
    'onboarding.modal.title': 'Takk for at du sendte inn skjemaet!',
    'onboarding.modal.message': 'Vi vil komme tilbake til deg så raskt vi kan. I mellomtiden, sjekk ut disse ressursene:',
    'onboarding.modal.viewResources': 'Se ressurser',
    
    // Services
    'services.title': 'AI Tjenester',
    'services.description': 'Hjelp med å utnytte AI for å forbedre din virksomhet eller personlige produktivitet.',
    'services.card1.title': 'AI Strategi & Konsultering',
    'services.card1.description': 'Få ekspertveiledning for å utvikle en AI-strategi som passer din virksomhet.',
    'services.card1.benefits': 'Strategisk planlegging, Bransjespesifikk veiledning, Implementeringsstøtte',
    'services.card2.title': 'Automatisering & Effektivitet',
    'services.card2.description': 'Bygg effektive systemer som automatiserer repetitivt arbeid og frigjør tid.',
    'services.card2.benefits': 'Workflow-automatisering, Integrasjoner, Tidsbesparelse',
    'services.card3.title': 'Workshops & Opplæring',
    'services.card3.description': 'Praktisk opplæring i AI-verktøy og teknikker for deg og teamet ditt.',
    'services.card3.benefits': 'Praktisk opplæring, Teamworkshops, Kontinuerlig støtte',
    'services.getStarted': 'Kom i gang',
    'services.cta': 'Klar til å komme i gang? → Start onboarding-skjemaet',
    'nav.services': 'Tjenester',
    
    // Blog
    'blog.readMore': 'Les mer',
    'blog.needHelp': 'Trenger hjelp?',
    'blog.relatedLinks': 'Relaterte lenker',
    'blog.affiliate': 'Affiliate',
    'blog.helpApply': 'Vil du hjelpe med å anvende dette?',
    'blog.helpApplyDesc': 'Start onboarding-skjemaet for å få personlig veiledning',
    'blog.articleNotFound': 'Artikkel ikke funnet',
    'blog.articleNotFoundDesc': 'Artikkelen du leter etter finnes ikke.',
    'blog.backToNews': 'Tilbake til nyheter',
    'blog.relatedArticles': 'Relaterte artikler',
    'blog.viewAllNews': 'Se alle nyheter',
    
    // Courses
    'courses.lessons': 'Leksjoner',
    'courses.free': 'Gratis',
    'courses.viewCourse': 'Se kurs',
    'courses.backToCourses': 'Tilbake til kurs',
    'courses.notFound': 'Kurs ikke funnet',
    'courses.notFoundDesc': 'Kurset du leter etter finnes ikke.',
    'courses.freeCourse': 'Gratis kurs - ingen betaling påkrevd',
    'courses.enrollNow': 'Meld deg på nå',
    
    // Portfolio
    'portfolio.featured': 'Utvalgt',
    'portfolio.liveDemo': 'Live Demo',
    'portfolio.github': 'GitHub',
    'portfolio.viewDetails': 'Se detaljer',
    'portfolio.backToPortfolio': 'Tilbake til portefølje',
    'portfolio.notFound': 'Prosjekt ikke funnet',
    'portfolio.notFoundDesc': 'Prosjektet du leter etter finnes ikke.',
    'portfolio.techStack': 'Teknologistack',
    'portfolio.viewLiveDemo': 'Se live demo',
    'portfolio.viewOnGitHub': 'Se på GitHub',
    'portfolio.projectGallery': 'Prosjektgalleri',
    
    // About
    'about.title': 'Om',
    'about.para1': 'Jeg heter Sebastian Saethre og jobber for å gjøre kunstig intelligens tilgjengelig og praktisk for alle. Målet mitt er å bygge en bro mellom komplekse AI-konsepter og virkelige applikasjoner på tvers av bransjer.',
    'about.para2': 'Gjennom denne plattformen deler jeg praktiske innsikter, verktøygjennomganger, kurs og ressurser som hjelper enkeltpersoner og organisasjoner med å utnytte AI effektivt. Enten du er interessert i bildegenerering, videokreering, programmering med AI eller utforsking av banebrytende verktøy, finner du verdifullt innhold her.',
    'about.para3': 'Tilnærmingen min til AI-utdanning fokuserer på "vibe coding" - en praktisk, hands-on metodikk som legger vekt på eksperimentering og virkelig anvendelse fremfor teori. Bli med i fellesskapet for å koble til, lære og utforske det revolusjonerende potensialet til AI sammen.',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.events': 'Arrangementer',
    'admin.blog': 'Nyheter',
    'admin.courses': 'Kurs',
    'admin.resources': 'Ressurser',
    'admin.portfolio': 'Portefølje',
    'admin.messages': 'Meldinger',
    'admin.members': 'Medlemmer',
    'admin.social': 'Sosiale medier',
    'admin.content': 'Innhold',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.portfolio': 'Portfolio',
    'nav.blog': 'News',
    'nav.courses': 'Courses',
    'nav.resources': 'Resources',
    'nav.products': 'Products',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.close': 'Close',
    'common.title': 'Title',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.optional': 'optional',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.submit': 'Submit',
    'common.of': 'of',
    'common.backToHome': 'Back to Home',
    
    // Homepage
    'home.title': 'Sebastian Saethre',
    'home.subtitle': '',
    'home.description': 'Making AI accessible, practical, and transformative across all industries.',
    'home.cta.blog': 'Latest news',
    'home.cta.resources': 'Useful AI Tools',
    'home.cta.courses': 'Free Courses',
    'home.cta.community': 'Join Community',
    'home.cta.onboarding': 'Start AI Onboarding',
    'home.featured.blog': 'Latest news',
    'home.featured.blog.desc': 'Explore practical AI applications, tools, and insights.',
    'home.featured.courses': 'Free Courses',
    'home.featured.courses.desc': 'Learn AI the practical way with our free course offerings.',
    'home.featured.resources': 'AI Tools & Resources',
    'home.featured.resources.desc': 'Discover the best AI tools, resources, and recommendations.',
    
    // Footer
    'footer.tagline': '',
    'footer.tagline.desc': 'Making AI accessible and practical for everyone.',
    'footer.connect': 'Connect',
    'footer.quickLinks': 'Quick Links',
    'footer.latestArticles': 'Latest news',
    'footer.freeCourses': 'Free Courses',
    'footer.joinCommunity': 'Join Community',
    'footer.getInTouch': 'Get in Touch',
    'footer.rights': 'All rights reserved.',
    'footer.admin': 'Admin',
    
    // Pages
    'portfolio.title': 'Portfolio',
    'portfolio.description': 'Showcasing projects and work across web development, AI applications, and content creation.',
    'portfolio.comingSoon': 'Portfolio content coming soon. Projects will be displayed here.',
    
    'blog.title': 'News',
    'blog.description': 'Practical AI insights, tutorials, tool reviews, and industry applications.',
    'blog.comingSoon': 'News coming soon.',
    
    'courses.title': 'Courses',
    'courses.description': 'Learn AI the practical way. Free and paid courses on AI applications, coding, and tools.',
    'courses.comingSoon': 'Course listings coming soon. Available courses will be displayed here.',
    
    'resources.title': 'Resources',
    'resources.description': 'Curated AI tools, resources, and recommendations. Find what\'s worth your time.',
    'resources.comingSoon': 'Resources coming soon. Tools and recommendations will be displayed here.',
    'resources.readMore': 'Read more',
    'resources.visit': 'Visit',
    'resources.worthIt': 'Worth it',
    'resources.all': 'All',
    'resources.notFound': 'Resource Not Found',
    'resources.notFoundDesc': 'The resource you\'re looking for doesn\'t exist.',
    'resources.backToResources': 'Back to Resources',
    'resources.needHelp': 'Need help?',
    
    'community.title': 'Community',
    'community.description': 'Join our community - Discord, Newsletter, Free Courses, and more.',
    'community.comingSoon': 'Community features coming soon. Discord, newsletter signup, and community tiers will be available here.',
    'community.stayUpdated': 'Stay Updated',
    'community.thankYouSubscribed': 'Thank you for subscribing! Check your email to confirm.',
    'community.subscribing': 'Subscribing...',
    'community.subscribe': 'Subscribe',
    'community.enterEmail': 'Enter your email',
    'community.alreadySubscribed': 'You are already subscribed!',
    'community.subscribedLocal': 'Subscribed! (Saved locally)',
    'community.sorryError': 'Sorry, something went wrong. Please try again later.',
    'community.discordTitle': 'Discord Community',
    'community.discordDesc': 'Join our Discord server for real-time discussions, Q&A sessions, and networking with other AI enthusiasts.',
    'community.joinDiscord': 'Join Discord',
    'community.newsletterTitle': 'Newsletter',
    'community.newsletterDesc': 'Get weekly updates on AI tools, tutorials, and industry insights delivered to your inbox.',
    'community.keepUpdatedTitle': 'Keep Updated',
    'community.keepUpdatedDesc': 'Follow me on Twitter and YouTube for the latest updates, tips, and insights about AI.',
    'community.exclusiveTitle': 'Exclusive Resources',
    'community.exclusiveDesc': 'Get early access to new tools, templates, and resources before they\'re publicly available.',
    'community.learnMore': 'Learn More',
    'community.readyToJoin': 'Ready to Join?',
    'community.joinMessage': 'Start your AI journey today and connect with a community of like-minded individuals.',
    'community.getStarted': 'Get Started',
    
    'contact.title': 'Contact',
    'contact.getInTouch': 'Get in Touch',
    'contact.description': 'Have questions or want to collaborate? I\'d love to hear from you. Send me a message, and I\'ll respond as soon as possible.',
    
    // Onboarding
    'onboarding.title': 'AI Onboarding',
    'onboarding.step': 'Step',
    'onboarding.step1.title': 'What are you looking for?',
    'onboarding.step1.personal': 'Personal use',
    'onboarding.step1.professional': 'Professional use',
    'onboarding.step2.title': 'What are your goals?',
    'onboarding.step2.personal.goals': 'Learning, Productivity, Creativity, Automation, Other',
    'onboarding.step2.professional.goals': 'Marketing, Customer Service, Internal Operations, Education, Other',
    'onboarding.step3.title': 'How are you currently using AI tools?',
    'onboarding.step3.placeholder': 'Describe how you use AI tools today, or if you don\'t use them yet...',
    'onboarding.step3.options': 'I don\'t use AI yet, I use ChatGPT occasionally, I use AI for work, I use AI for personal projects, I\'m an AI power user',
    'onboarding.step3.elaborate': 'Tell us more (optional)',
    'onboarding.step4.title': 'What is your biggest challenge?',
    'onboarding.step4.placeholder': 'Describe what you hope AI can help you with...',
    'onboarding.step4.options': 'I don\'t know where to start, I want to save time, I want to be more creative, I want to automate tasks, I want to learn new skills, I want to improve my work',
    'onboarding.step4.elaborate': 'Tell us more (optional)',
    'onboarding.step5.title': 'Contact Information',
    'onboarding.step5.companyName': 'Company Name',
    'onboarding.step5.industry': 'Industry',
    'onboarding.consent': 'I consent to my data being used for follow-up',
    'onboarding.sending': 'Sending...',
    'onboarding.thanks.title': 'Thank you for your interest!',
    'onboarding.thanks.message': 'We\'ll be in touch soon to discuss how we can help you with AI.',
    'onboarding.thanks.calendly': 'Want to schedule a meeting?',
    'onboarding.thanks.schedule': 'Schedule a meeting here',
    'onboarding.thanks.readInsights': 'Read My Insights',
    'onboarding.modal.title': 'Thank you for submitting!',
    'onboarding.modal.message': 'We will get back to you as fast as we can. In the meanwhile, check out these resources:',
    'onboarding.modal.viewResources': 'View Resources',
    
    // Services
    'services.title': 'AI Services',
    'services.description': 'Help leveraging AI to improve your business or personal productivity.',
    'services.card1.title': 'AI Strategy & Consulting',
    'services.card1.description': 'Get expert guidance to develop an AI strategy that fits your business.',
    'services.card1.benefits': 'Strategic planning, Industry-specific guidance, Implementation support',
    'services.card2.title': 'Automation & Efficiency Systems',
    'services.card2.description': 'Build efficient systems that automate repetitive work and free up time.',
    'services.card2.benefits': 'Workflow automation, Integrations, Time savings',
    'services.card3.title': 'Workshops & Training',
    'services.card3.description': 'Practical training in AI tools and techniques for you and your team.',
    'services.card3.benefits': 'Hands-on training, Team workshops, Ongoing support',
    'services.getStarted': 'Get Started',
    'services.cta': 'Ready to get started? → Start the onboarding form',
    'nav.services': 'Services',
    
    // Blog
    'blog.readMore': 'Read more',
    'blog.needHelp': 'Need help?',
    'blog.relatedLinks': 'Related links',
    'blog.affiliate': 'Affiliate',
    'blog.helpApply': 'Want help applying this?',
    'blog.helpApplyDesc': 'Start the onboarding form to get personal guidance',
    'blog.articleNotFound': 'Article Not Found',
    'blog.articleNotFoundDesc': 'The article you\'re looking for doesn\'t exist.',
    'blog.backToNews': 'Back to News',
    'blog.relatedArticles': 'Related Articles',
    'blog.viewAllNews': 'View All News',
    
    // Courses
    'courses.lessons': 'Lessons',
    'courses.free': 'Free',
    'courses.viewCourse': 'View Course',
    'courses.backToCourses': 'Back to Courses',
    'courses.notFound': 'Course Not Found',
    'courses.notFoundDesc': 'The course you\'re looking for doesn\'t exist.',
    'courses.freeCourse': 'Free course - no payment required',
    'courses.enrollNow': 'Enroll Now',
    
    // Portfolio
    'portfolio.featured': 'Featured',
    'portfolio.liveDemo': 'Live Demo',
    'portfolio.github': 'GitHub',
    'portfolio.viewDetails': 'View Details',
    'portfolio.backToPortfolio': 'Back to Portfolio',
    'portfolio.notFound': 'Project Not Found',
    'portfolio.notFoundDesc': 'The project you\'re looking for doesn\'t exist.',
    'portfolio.techStack': 'Tech Stack',
    'portfolio.viewLiveDemo': 'View Live Demo',
    'portfolio.viewOnGitHub': 'View on GitHub',
    'portfolio.projectGallery': 'Project Gallery',
    
    // Resources
    
    // About
    'about.title': 'About',
    'about.para1': 'I\'m Sebastian Saethre, dedicated to making artificial intelligence accessible and practical for everyone. My mission is to bridge the gap between complex AI concepts and real-world applications across all industries.',
    'about.para2': 'Through this platform, I share practical insights, tool reviews, courses, and resources that help individuals and organizations leverage AI effectively. Whether you\'re interested in image generation, video creation, coding with AI, or exploring cutting-edge tools, you\'ll find valuable content here.',
    'about.para3': 'My approach to AI education focuses on "vibe coding" - a practical, hands-on methodology that emphasizes experimentation and real-world application over theory. Join our community to connect, learn, and explore the transformative potential of AI together.',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.events': 'Events',
    'admin.blog': 'News',
    'admin.courses': 'Courses',
    'admin.resources': 'Resources',
    'admin.portfolio': 'Portfolio',
    'admin.messages': 'Messages',
    'admin.members': 'Members',
    'admin.social': 'Social Media',
    'admin.content': 'Content',
  },
};

// Load language from localStorage or default to Norwegian
const getStoredLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language-storage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.state?.language || 'no';
      } catch {
        return 'no';
      }
    }
  }
  return 'no';
};

// Detect language based on IP/geolocation (async)
export const detectLanguageFromLocation = async (): Promise<Language> => {
  try {
    // Use a free geolocation API to detect country
    const response = await fetch('https://ipapi.co/json/', { 
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    
    // If country is Norway, return Norwegian, otherwise English
    if (data.country_code === 'NO') {
      return 'no';
    }
    return 'en';
  } catch (error) {
    console.warn('Could not detect location, defaulting to English:', error);
    return 'en'; // Default to English if detection fails
  }
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getStoredLanguage(),
  setLanguage: (lang: Language) => {
    set({ language: lang });
    if (typeof window !== 'undefined') {
      localStorage.setItem('language-storage', JSON.stringify({ state: { language: lang } }));
    }
  },
  t: (key: string, params?: Record<string, string | number>) => {
    const lang = get().language;
    let translation = translations[lang][key] || translations['en'][key] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  },
}));
