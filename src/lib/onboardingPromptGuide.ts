import type { OnboardingFormData } from '../stores/onboardingStore';

export type PromptGuideLanguage = 'no' | 'en';

export interface PromptGuideResult {
  persona: 'beginnerPersonal' | 'advancedPersonal' | 'beginnerBusiness' | 'advancedBusiness';
  summaryTitle: string;
  summary: string;
  fullGuide: string;
  emailSubject: string;
  mailtoHref: string;
}

const containsAny = (haystack: string, needles: string[]) => {
  const h = haystack.toLowerCase();
  return needles.some(n => h.includes(n.toLowerCase()));
};

const includesOption = (options: string[] | undefined, optionCandidates: string[]) => {
  const list = options || [];
  const lower = list.map(x => (x || '').toLowerCase());
  return optionCandidates.some(c => lower.includes(c.toLowerCase()));
};

const getPrimaryGoal = (goals: string[]) => (goals && goals.length > 0 ? goals[0] : '');

export function buildOnboardingPromptGuide(data: OnboardingFormData, language: PromptGuideLanguage): PromptGuideResult {
  const isNo = language === 'no';

  const beginnerCurrentUsage = isNo
    ? includesOption(data.current_usage_options, ['Jeg bruker ikke AI ennå'])
    : includesOption(data.current_usage_options, ["I don't use AI yet"]);

  const beginnerPainStart = isNo
    ? includesOption(data.pain_points_options, ['Jeg vet ikke hvor jeg skal starte'])
    : includesOption(data.pain_points_options, ["I don't know where to start"]);

  const beginnerFreeText =
    (data.pain_points || '').toLowerCase().includes('ny') ||
    (data.pain_points || '').toLowerCase().includes('start') ||
    (data.current_usage || '').toLowerCase().includes('ikke');

  const explicitlyBeginner = beginnerCurrentUsage || beginnerPainStart || beginnerFreeText;
  const isAdvancedUser = isNo
    ? includesOption(data.current_usage_options, ['Jeg er en AI power user'])
    : includesOption(data.current_usage_options, ["I'm an AI power user"]);

  const persona =
    data.type === 'personal'
      ? explicitlyBeginner
        ? ('beginnerPersonal' as const)
        : isAdvancedUser
          ? ('advancedPersonal' as const)
          : ('advancedPersonal' as const)
      : explicitlyBeginner
        ? ('beginnerBusiness' as const)
        : isAdvancedUser
          ? ('advancedBusiness' as const)
          : ('advancedBusiness' as const);

  const goalsLine = data.goals?.length ? data.goals.join(', ') : (isNo ? 'Ikke spesifisert' : 'Not specified');
  const industryLine = data.type === 'professional' && data.industry ? data.industry : (isNo ? 'din bransje' : 'your industry');
  const companyLine =
    data.type === 'professional' && data.company_name
      ? isNo
        ? ` hos ${data.company_name}`
        : ` at ${data.company_name}`
      : '';

  const name = data.name?.trim() || (isNo ? 'der' : 'there');
  const primaryGoal = getPrimaryGoal(data.goals || []);

  const painPointsSelected = (data.pain_points_options || []).filter(Boolean);
  const painText = (data.pain_points || '').trim();

  const currentUsage = (data.current_usage || '').trim();
  const currentUsageOptionsLine = (data.current_usage_options || []).filter(Boolean).join(', ');

  const topPain =
    painPointsSelected.length > 0 ? painPointsSelected[0] : painText || (isNo ? 'Du ønsker hjelp til å komme i gang' : 'You want help getting started');

  const channelLine = data.type === 'personal'
    ? (isNo ? 'Som privatperson' : 'As an individual')
    : (isNo ? `Som bedrift${companyLine}` : `As a business${companyLine}`);

  const toneIntro = isNo
    ? `Hei ${name}! Jeg leste gjennom valgene dine, og jeg liker hvordan du tenker. Det du trenger nå er ikke “mer info” – men et lite, konkret oppsett du kan bruke med en gang.`
    : `Hi ${name}! I went through your answers, and I like your mindset. What you need now isn’t “more information” – it’s a small, concrete setup you can use immediately.`;

  const goalSpecificBeat = (() => {
    const g = (primaryGoal || '').toLowerCase();
    const match = (s: string) => g.includes(s.toLowerCase());

    if (data.type === 'professional') {
      if (match('markedsføring') || match('marketing')) {
        return isNo
          ? 'Du kommer til å få raskest verdi ved å la AI lage utkast til kampanjer, og så iterere basert på din stemme og målgruppe.'
          : 'You’ll get the fastest value by having AI draft campaigns, then iterating based on your voice and audience.';
      }
      if (match('kons') || match('kundeservice') || match('customer')) {
        return isNo
          ? 'AI kan hjelpe dere med svarflyt: første utkast, variasjoner, og kvalitetssjekk før publisering.'
          : 'AI can help your team with answer workflows: first drafts, variations, and quality checks before sending.';
      }
      if (match('utd') || match('education')) {
        return isNo
          ? 'Start med å gjøre eksisterende materiale om til tydelige læringsstier og korte øvingsoppgaver.'
          : 'Start by turning existing material into clear learning paths and short practice exercises.';
      }
      if (match('automatis') || match('automation') || match('effektivitet')) {
        return isNo
          ? 'Du får mest igjen ved å velge én “repetitiv maskinjobb” og automatisere fra input til ferdig output.'
          : 'You’ll get the most by choosing one repetitive “machine job” and automating input-to-output.';
      }
      return isNo
        ? `I ${industryLine} får dere mest ut av AI ved å kombinere tydelig kontekst med konkrete output-formater.`
        : `In ${industryLine}, you’ll get the most out of AI by combining clear context with concrete output formats.`;
    }

    // personal
    if (match('læring') || match('learning')) {
      return isNo
        ? 'Den beste gevinsten for deg er en læringssløyfe: forklar -> eksempel -> øv -> tilbakemelding.'
        : 'The best gain for you is a learning loop: explain -> example -> practice -> feedback.';
    }
    if (match('produktiv') || match('productivity')) {
      return isNo
        ? 'Fokuset bør være å redusere “tomgang”: AI skal produsere utkast du raskt kan gjøre ferdig.'
        : 'Your focus should be reducing “idle time”: let AI produce drafts you can quickly finalize.';
    }
    if (match('kreativ') || match('creativity')) {
      return isNo
        ? 'Kreativitet handler mindre om inspirasjon og mer om gode rammer. Vi lager dem.'
        : 'Creativity is less about inspiration and more about good constraints. We’ll build those.';
    }
    if (match('automatis') || match('automation')) {
      return isNo
        ? 'Automatisering for deg betyr: velg en oppgave, definer “ferdig”, og la AI levere det hver gang.'
        : 'Automation for you means: pick a task, define “done”, and make AI deliver it every time.';
    }

    return isNo
      ? `Målet ditt peker mot at du trenger en fast prompt-ramme som gjør AI nyttig uten å kreve mye arbeid.`
      : `Your goal suggests you need a reusable prompt framework that makes AI useful without extra effort.`;
  })();

  const summaryTitle = isNo ? 'Din prompt guide i korte trekk' : 'Your prompt guide at a glance';

  const summary = (isNo
    ? `Basert på det du svarte, er planen min:\n\n1) Start med én konkret “arbeidsflyt” som gir verdi direkte (${primaryGoal || 'ditt første mål'}).\n2) Bruk en fast prompt-ramme (jeg gir deg den) som alltid ber om riktige detaljer.\n3) Iterer i små runder: du gir tilbakemelding, AI lager bedre versjoner.\n4) Kjør en ukeplan (sprint) med konkrete leveranser.\n5) Evaluer etter 7–14 dager og skaler til flere use cases.\n\nSpisset mot dine behov:\n- Type: ${channelLine}\n- Bransje: ${industryLine}\n- Det som stikker seg ut: ${topPain}\n\nSe den fulle guiden i e-posten (med prompt-pakker du kan kopiere).`
    : `Based on what you selected, here’s the plan:\n\n1) Start with one specific workflow that delivers value immediately (${primaryGoal || 'your first goal'}).\n2) Use a fixed prompt framework (I provide it) that asks for the right details every time.\n3) Iterate in small rounds: you provide feedback, AI produces better versions.\n4) Run a weekly sprint with concrete deliverables.\n5) Evaluate after 7–14 days and expand to more use cases.\n\nTailored to your needs:\n- Type: ${channelLine}\n- Industry: ${industryLine}\n- The most important pain: ${topPain}\n\nThe full guide (with prompt packs to copy) is in the email.`);

  const promptFramework = isNo
    ? `PROMPT-RAMME (du gjenbruker den hver gang)\n\nRolle:\nDu er min praktiske AI-assistent for ${data.type === 'professional' ? 'bedriftsarbeid' : 'personlig bruk'}.\n\nMål:\nHjelp meg å oppnå: ${goalsLine}.\n\nKontekst (lim inn her):\n- Bransje/område: ${industryLine}\n- Nåværende AI-bruk: ${currentUsageOptionsLine || (currentUsage ? currentUsage : (isNo ? 'Ikke oppgitt' : 'Not provided'))}\n- Utfordring(er): ${topPain}\n- (valgfritt) Dette jeg prøver å få til akkurat nå: ${currentUsage || (painText ? painText : (isNo ? '...' : '...'))}\n\nOppgave:\nLag et konkret leveranseforslag + en prompt-pakke jeg kan bruke.\n\nOutputformat (viktig):\n1) Kort plan (maks 10 punkter)\n2) 2–3 ferdige prompt-tekster (klar til copy/paste)\n3) Eksempel på “input -> output” (kort)\n4) Sjekkliste: hva jeg må svare på for å gjøre neste iterasjon bedre\n\nBegrensninger:\n- Ikke oppgi generiske råd uten eksempler.\n- Still 3 avklarende spørsmål før du leverer hvis noe er uklart.\n`
    : `PROMPT FRAMEWORK (reuse it every time)\n\nRole:\nYou are my practical AI assistant for ${data.type === 'professional' ? 'business work' : 'personal use'}.\n\nGoal:\nHelp me achieve: ${goalsLine}.\n\nContext (paste here):\n- Industry/area: ${industryLine}\n- Current AI usage: ${currentUsageOptionsLine || (currentUsage ? currentUsage : 'Not provided')}\n- Pain points: ${topPain}\n- (optional) What I’m trying to accomplish right now: ${currentUsage || (painText ? painText : '...')}\n\nTask:\nCreate a concrete deliverable plan + a prompt pack I can use.\n\nOutput format (important):\n1) Short plan (max 10 bullets)\n2) 2–3 ready-to-copy prompt texts\n3) Example of “input -> output” (short)\n4) Checklist: what I should answer next time to improve the next iteration\n\nConstraints:\n- Don’t give generic advice without examples.\n- Ask 3 clarification questions before delivering if something is unclear.\n`;

  const promptPacks = (() => {
    const common = isNo
      ? `KORT FAKTA OM DEG (brukes i promptene)\n- Navn: ${name}\n- Mål: ${goalsLine}\n- Nåværende bruk: ${currentUsageOptionsLine || (currentUsage ? currentUsage : 'Ikke oppgitt')}\n- Utfordringer: ${(data.pain_points_options || []).length ? (data.pain_points_options || []).join(', ') : (painText || 'Ikke oppgitt')}\n`
      : `QUICK FACTS ABOUT YOU (for the prompts)\n- Name: ${name}\n- Goals: ${goalsLine}\n- Current usage: ${currentUsageOptionsLine || (currentUsage ? currentUsage : 'Not provided')}\n- Challenges: ${(data.pain_points_options || []).length ? (data.pain_points_options || []).join(', ') : (painText || 'Not provided')}\n`;

    const personaDepth = persona.includes('beginner')
      ? isNo
        ? `\nDin “begynnermodus”: vi gjør dette lavterskel. Målet er at du får en første mini-seier raskt, så du bygger momentum.`
        : `\nYour “beginner mode”: we keep it low-friction. The goal is your first mini-win quickly, so you build momentum.`
      : isNo
        ? `\nDin “avansert modus”: du får mer presisjon. Vi gjør promptene mer robuste, og vi lager en plan for iterasjon og måling.`
        : `\nYour “advanced mode”: more precision. We’ll make the prompts more robust and set up iteration and measurement.`;

    const deepGuidance = (() => {
      if (persona.includes('beginner')) {
        return isNo
          ? `\nHvordan du bruker promptene (enkelt, men riktig):\n- Kopier én prompt.\n- Fyll inn “Kontekst”-delen med det du faktisk vet (ikke perfeksjon).\n- Be AI levere 1 iterasjon.\n- Velg det som føles “nært nok”, og be AI forbedre den delen du peker ut.\n- Ta en 20-minutters runde i kalenderen før du prøver på flere.\n`
          : `\nHow to use the prompts (simple, but correct):\n- Copy one prompt.\n- Fill in the “Context” section with what you actually know (no perfection needed).\n- Ask AI to deliver one iteration.\n- Pick what feels “good enough”, then ask AI to improve the part you point to.\n- Put a 20-minute session on your calendar before doing more.\n`;
      }

      return isNo
        ? `\nHvordan du bruker promptene (for deg som allerede er i gang):\n- Kjør promptene med faste output-formater.\n- Etter første svar: be AI “grader kvaliteten” mot en sjekkliste.\n- Lim inn dine faktiske resultater (utkast/tekst), ikke generiske beskrivelser.\n- Gjør iterasjon til en rutine: samme prompt, men med nye constraints.\n`
        : `\nHow to use the prompts (for people already in motion):\n- Run prompts with fixed output formats.\n- After the first answer: ask AI to grade quality against a checklist.\n- Paste your real outputs (drafts/text), not generic descriptions.\n- Make iteration a habit: same prompt, new constraints.\n`;
    })();

    const prompt1 = isNo
      ? `PROMPT 1: AI-workflow for “første verdi”\n\nBruker:\n${common}\n\nOppgave:\nJeg vil at du lager en konkret workflow som passer mine mål (${goalsLine}) og min utfordring (${topPain}).\n\nLeveranse:\n1) Hvilken arbeidsflyt bør jeg starte med (velg 1)\n2) Hvilket input må jeg ha klart (liste)\n3) Hva skal output se ut som (eksempel)\n4) En prompt-pakke jeg kan gjenbruke (2–3 prompt-tekster)\n\nVær praktisk: gi meg et oppsett jeg kan kjøre i løpet av 30–60 minutter.\n${personaDepth}\n`
      : `PROMPT 1: AI-workflow for “first value”\n\nUser:\n${common}\n\nTask:\nI want you to create a concrete workflow that fits my goals (${goalsLine}) and my challenge (${topPain}).\n\nDeliverable:\n1) Which workflow should I start with (choose 1)\n2) What input do I need prepared (list)\n3) What the output should look like (example)\n4) A reusable prompt pack (2–3 prompt texts)\n\nBe practical: give me a setup I can run in 30–60 minutes.\n${personaDepth}\n`;
    const prompt2 = isNo
      ? `PROMPT 2: Lag 3 prompt-templates tilpasset meg\n\nBruker:\n${common}\n\nOppgave:\nLag 3 prompt-templates for meg.\n\nKrav:\n- 1 template for “utkast” (draft)\n- 1 template for “forbedring” (iteration)\n- 1 template for “kvalitetssjekk” (grading)\n\nHver template skal ha:\n- Rolle\n- Kontekst-felt (hva jeg limer inn)\n- Output-format\n- Begrensninger\n- 3 avklarende spørsmål\n`
      : `PROMPT 2: Create 3 prompt templates tailored to me\n\nUser:\n${common}\n\nTask:\nCreate 3 prompt templates for me.\n\nRequirements:\n- 1 template for “draft”\n- 1 template for “iteration / improvement”\n- 1 template for “quality check / grading”\n\nEach template must include:\n- Role\n- Context fields (what I paste in)\n- Output format\n- Constraints\n- 3 clarification questions\n`;
    const prompt3 = isNo
      ? `PROMPT 3: Iterer til bedre resultat (uten LLM-støy)\n\nJeg skal bruke AI til: ${goalsLine}\n\nKjør denne runden slik:\n1) Gi meg en kort forbedringsplan\n2) Skriv en “revidert prompt” basert på svakhetene i forrige output\n3) Fortell meg nøyaktig hva jeg bør svare på (3 punkter) for å gjøre neste iterasjon skarp\n\nInput (lim inn her):\n- Mitt forrige utkast:\n- Hva jeg likte:\n- Hva som var uklart / dårlig:\n- Målet med neste versjon:\n`
      : `PROMPT 3: Iterate to better results (no LLM noise)\n\nI will use AI for: ${goalsLine}\n\nRun this round like this:\n1) Give me a short improvement plan\n2) Write a “revised prompt” based on the weaknesses in my previous output\n3) Tell me exactly what I should answer (3 points) to make the next iteration sharp\n\nInput (paste here):\n- My previous draft:\n- What I liked:\n- What was unclear / bad:\n- The goal for the next version:\n`;

    const prompt4 = isNo
      ? `PROMPT 4: 14-dagers sprintplan (mini-sprints)\n\nBruker:\n${common}\n\nOppgave:\nLag en 14-dagers plan i 5 steg.\n\nFormat:\n- Dag 1–2: oppsett (konkret)\n- Dag 3–5: første output (konkret)\n- Dag 6–9: forbedring (konkret)\n- Dag 10–12: “proof” (et resultat jeg kan vise frem)\n- Dag 13–14: evaluering + neste steg\n\nHver dag skal ha:\n- Hva jeg gjør (maks 30 min)\n- Prompt-tekst (kort) eller hvilken template jeg bruker\n- Hva output skal inneholde\n`
      : `PROMPT 4: 14-day sprint plan (mini-sprints)\n\nUser:\n${common}\n\nTask:\nCreate a 14-day plan in 5 steps.\n\nFormat:\n- Day 1–2: setup (concrete)\n- Day 3–5: first output (concrete)\n- Day 6–9: improvement (concrete)\n- Day 10–12: “proof” (a result I can show)\n- Day 13–14: evaluation + next step\n\nEach day should include:\n- What I do (max 30 minutes)\n- Prompt text (short) or which template I use\n- What the output must include\n`;

    const prompt5 = isNo
      ? `PROMPT 5: Sjekkliste + kvalitetsscore\n\nOppgave:\nJeg vil at du skal kvalitetssjekke output mot mine mål (${goalsLine}) og min utfordring (${topPain}).\n\nKrev:\n- Gi en score fra 0–10 på 5 kriterier\n- Fortell meg hva som mangler for å komme til 9–10\n- Foreslå 2 konkrete “re-prompts” jeg kan kjøre for å rette opp\n\nKriterier:\n- Klarhet\n- Relevans til bransje/kontekst\n- Handling/konkretisering\n- Tone (svarer på min stil)\n- Risiko (hallusinasjoner / antakelser)\n\nInput (lim inn her):\n- Output jeg vil sjekke:\n- Målgruppen/min situasjon:\n`
      : `PROMPT 5: Checklist + quality score\n\nTask:\nI want you to quality-check my output against my goals (${goalsLine}) and my challenge (${topPain}).\n\nRequirements:\n- Give a 0–10 score on 5 criteria\n- Tell me what’s missing to reach 9–10\n- Suggest 2 concrete “re-prompts” I can run to fix it\n\nCriteria:\n- Clarity\n- Relevance to industry/context\n- Actionability / concretization\n- Tone (matches my style)\n- Risk (hallucinations / assumptions)\n\nInput (paste here):\n- Output I will check:\n- Target audience/my situation:\n`;

    return (
      prompt1 +
      '\n' +
      prompt2 +
      '\n' +
      prompt3 +
      '\n' +
      prompt4 +
      '\n' +
      prompt5 +
      '\n' +
      deepGuidance
    );
  })();

  const fullGuide = (() => {
    const greeting = toneIntro;
    const personalContext = isNo
      ? `\nKonteksten din (slik jeg forstår den):\n- Type: ${channelLine}\n- Mål: ${goalsLine}\n- Nåværende AI-bruk: ${currentUsageOptionsLine || (currentUsage ? currentUsage : 'Ikke oppgitt')}\n- Utfordringer: ${painPointsSelected.length ? painPointsSelected.join(', ') : (painText || 'Ikke oppgitt')}\n- Bransje: ${data.type === 'professional' ? (data.industry || 'Ikke oppgitt') : 'N/A'}\n`
      : `\nYour context (how I interpret it):\n- Type: ${channelLine}\n- Goals: ${goalsLine}\n- Current AI usage: ${currentUsageOptionsLine || (currentUsage ? currentUsage : 'Not provided')}\n- Challenges: ${painPointsSelected.length ? painPointsSelected.join(', ') : (painText || 'Not provided')}\n- Industry: ${data.type === 'professional' ? (data.industry || 'Not provided') : 'N/A'}\n`;

    const implementationSteps = (() => {
      if (persona.includes('beginner')) {
        return isNo
          ? `\nSteg-for-steg: Slik kommer du i gang (uten overtenking)\n\nSteg 1 – Velg én arbeidsflyt\nVelg én ting du gjør ofte (f.eks. tekstutkast, idéer, svar, planlegging). Dette skal gi deg “første verdi” raskt.\n\nSteg 2 – Sett en fast prompt-ramme\nIkke start fra blank hver gang. Bruk PROMPT-RAMME (under) som din base.\n\nSteg 3 – Iterer i korte runder\nKjør en runde -> plukk én ting du vil forbedre -> gi feedback -> kjør igjen.\n\nSteg 4 – Gå fra prompt til rutine\nHa en ukentlig rutine: 20–40 minutter, én leveranse. Det er slik læring blir til effekt.\n\nSteg 5 – Bygg ut med samme mal\nNår du har én fungerende workflow, skaler til neste scenario.\n`
          : `\nStep-by-step: How to get started (without overthinking)\n\nStep 1 – Pick one workflow\nChoose one thing you do often (drafts, ideas, answers, planning). This should deliver your “first value” quickly.\n\nStep 2 – Use a fixed prompt framework\nDon’t start from scratch every time. Use the PROMPT FRAME below as your base.\n\nStep 3 – Iterate in short rounds\nRun once -> pick one thing to improve -> give feedback -> run again.\n\nStep 4 – Turn prompts into a routine\nUse a weekly habit: 20–40 minutes, one deliverable. That’s how learning turns into impact.\n\nStep 5 – Expand using the same template\nOnce you have one working workflow, scale to the next scenario.\n`;
      }

      return isNo
        ? `\nSteg-for-steg: Slik får du system i AI-bruken\n\nSteg 1 – Definer output-krav (før du prompt’er)\nNår outputformat er tydelig, blir resultatet mye mer konsistent.\n\nSteg 2 – Bygg robust prompt-arkitektur\nBruk PROMPT-RAMME som “kontrakt”. Det gjør iterasjon billig.\n\nSteg 3 – Iterer med graderingslogikk\nKjør prompt -> score mot sjekkliste -> re-prompts med nye constraints.\n\nSteg 4 – Lag en sprint for læring og kvalitet\nPlanlegg hva dere skal måle etter 7–14 dager (tid spart, kvalitet, leveranser).\n\nSteg 5 – Skaler med workflows, ikke enkeltsvar\nTenk system: input -> AI -> output -> kvalitetssjekk.\n`
        : `\nStep-by-step: How to make AI usage systematic\n\nStep 1 – Define output requirements (before prompting)\nWhen output format is clear, results become more consistent.\n\nStep 2 – Build a robust prompt architecture\nUse the PROMPT FRAME as your “contract”. Iteration becomes cheaper.\n\nStep 3 – Iterate with grading logic\nRun prompt -> score against checklist -> re-prompts with new constraints.\n\nStep 4 – Create a sprint for learning and quality\nPlan what you’ll measure after 7–14 days (time saved, quality, deliverables).\n\nStep 5 – Scale via workflows, not one-off answers\nThink systems: input -> AI -> output -> quality check.\n`;
    })();

    const closing = isNo
      ? `\nHvis du vil, kan du svare meg på samme e-posttråd etter at du har kjørt den første runden. Da kan vi justere promptene dine mot virkelige resultater – ikke antakelser.`
      : `\nIf you want, reply to me from the same email thread after you run the first round. We can refine your prompts based on real results – not assumptions.`;

    const subject = isNo ? `Din prompt guide for AI onboarding` : `Your AI onboarding prompt guide`;

    return [
      greeting,
      personalContext,
      '\n',
      implementationSteps,
      '\n',
      promptFramework,
      '\n',
      'PROMPT-PACKER (klar til copy/paste)\n',
      promptPacks,
      closing,
    ].join('\n');
  })();

  const emailSubject = isNo ? `Din prompt guide for AI onboarding` : `Your AI onboarding prompt guide`;
  const mailtoHref = `mailto:${data.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(fullGuide)}`;

  return {
    persona,
    summaryTitle,
    summary,
    fullGuide,
    emailSubject,
    mailtoHref,
  };
}

