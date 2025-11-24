import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, Mail, FileText, Eye, X, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingResponse {
  id: string;
  type: 'personal' | 'professional';
  goals: string[];
  current_usage: string;
  current_usage_options: string[];
  pain_points: string;
  pain_points_options: string[];
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  industry?: string;
  consent: boolean;
  created_at: string;
}

type PersonaType = 'beginnerPersonal' | 'advancedPersonal' | 'beginnerBusiness' | 'advancedBusiness';

interface EmailTemplate {
  subject: string;
  body: string;
}

export function OnboardingResponses() {
  const [responses, setResponses] = useState<OnboardingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<OnboardingResponse | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const openDetailModal = (response: OnboardingResponse) => {
    setSelectedResponse(response);
  };

  const closeDetailModal = () => {
    setSelectedResponse(null);
  };

  // Determine customer persona based on response data
  const determinePersona = (response: OnboardingResponse): PersonaType => {
    // Safely check arrays - handle null/undefined
    const currentUsageOptions = response.current_usage_options || [];
    const painPointsOptions = response.pain_points_options || [];
    const currentUsage = response.current_usage || '';
    const painPoints = response.pain_points || '';

    const isBeginner = 
      currentUsageOptions.length === 0 && 
      currentUsage.trim() === '' &&
      (painPointsOptions.includes('New to AI') || 
       painPointsOptions.includes('Helt ny i AI') ||
       painPoints.toLowerCase().includes('ny') ||
       painPoints.toLowerCase().includes('beginner') ||
       painPoints.toLowerCase().includes('starter'));

    if (response.type === 'personal') {
      return isBeginner ? 'beginnerPersonal' : 'advancedPersonal';
    } else {
      return isBeginner ? 'beginnerBusiness' : 'advancedBusiness';
    }
  };

  // Email templates for each persona
  const emailTemplates: Record<PersonaType, EmailTemplate> = {
    beginnerPersonal: {
      subject: 'Velkommen til AI-verdenen! 🚀',
      body: `Hei {name}!

Takk for at du tok deg tid til å fylle ut skjemaet! Jeg ser at du er ny i AI-verdenen, og det er helt greit - alle starter et sted.

Jeg hjelper deg gjerne med å komme i gang med praktisk AI-bruk. Her er noen ressurser som kan være nyttige for deg:

📚 Starter-ressurser:
- Enkle guider for å komme i gang med AI-verktøy
- Steg-for-steg tutorials for nybegynnere
- Eksempler på praktiske bruksområder

Jeg sender ut nyhetsbrev med tips og triks spesielt for nybegynnere. Hvis du har spørsmål, bare send meg en e-post!

Med vennlig hilsen,
Sebastian Saethre
AI Educator & Practitioner

---
Twitter: @seb_fs_ai
YouTube: @sebfsai`
    },
    advancedPersonal: {
      subject: 'Takk for din interesse! 🎯',
      body: `Hei {name}!

Takk for at du tok deg tid til å fylle ut skjemaet! Jeg ser at du allerede har erfaring med AI-verktøy, og det er flott.

Jeg kan hjelpe deg med å ta neste steg og utforske mer avanserte teknikker og verktøy. Her er noen ressurser som kan være relevante for deg:

🚀 Avanserte ressurser:
- Dypere dykker i AI-teknologi
- Avanserte teknikker og workflows
- Nyheter om nye verktøy og muligheter

Jeg sender ut nyhetsbrev med avanserte tips, nye verktøy og case studies. Hvis du har spørsmål eller ønsker å diskutere noe spesifikt, bare send meg en e-post!

Med vennlig hilsen,
Sebastian Saethre
AI Educator & Practitioner

---
Twitter: @seb_fs_ai
YouTube: @sebfsai`
    },
    beginnerBusiness: {
      subject: 'Velkommen - La oss ta bedriften din til neste nivå med AI 💼',
      body: `Hei {name}!

Takk for at du tok deg tid til å fylle ut skjemaet! Jeg ser at {company_info} og er ny i AI-verdenen.

Jeg hjelper bedrifter med å implementere AI på en praktisk og forretningsfokusert måte. Her er noen ressurser som kan være nyttige for dere:

📊 Forretningsfokuserte ressurser:
- AI-implementering for bedrifter
- ROI-analyse og case studies
- Best practices for AI-adopsjon
- Verktøy spesielt for forretningsbruk

Jeg sender ut nyhetsbrev med forretningsfokuserte AI-nyheter, case studies og tips for implementering. Hvis du ønsker å diskutere hvordan AI kan hjelpe bedriften din spesifikt, kan vi avtale et møte.

Med vennlig hilsen,
Sebastian Saethre
AI Educator & Practitioner

---
Twitter: @seb_fs_ai
YouTube: @sebfsai`
    },
    advancedBusiness: {
      subject: 'Takk for din interesse - La oss utvide AI-kompetansen din 💼',
      body: `Hei {name}!

Takk for at du tok deg tid til å fylle ut skjemaet! Jeg ser at {company_info} allerede har erfaring med AI-verktøy, og det er flott.

Jeg kan hjelpe dere med å ta neste steg og maksimere verdien av AI i bedriften. Her er noen ressurser som kan være relevante:

🎯 Avanserte forretningsressurser:
- Avanserte AI-strategier for bedrifter
- Skalering av AI-implementeringer
- Integrasjon med eksisterende systemer
- Nyheter om enterprise AI-verktøy

Jeg sender ut nyhetsbrev med avanserte forretningsfokuserte AI-nyheter, case studies og best practices. Hvis du ønsker å diskutere spesifikke utfordringer eller muligheter, kan vi avtale et møte.

Med vennlig hilsen,
Sebastian Saethre
AI Educator & Practitioner

---
Twitter: @seb_fs_ai
YouTube: @sebfsai`
    }
  };

  // Generate personalized email based on persona
  const generatePersonaEmail = (response: OnboardingResponse): { subject: string; body: string } => {
    const persona = determinePersona(response);
    const template = emailTemplates[persona];
    
    // Determine company info for business personas
    const companyInfo = response.company_name 
      ? `du representerer ${response.company_name}`
      : 'du representerer en bedrift';
    
    let body = template.body
      .replace(/{name}/g, response.name)
      .replace(/{company_info}/g, companyInfo);

    // Add personalized touches based on goals
    if (response.goals && response.goals.length > 0) {
      body += `\n\nBasert på målene dine (${response.goals.join(', ')}), kan jeg hjelpe deg med spesifikke ressurser og veiledning.`;
    }

    return {
      subject: template.subject,
      body: body
    };
  };

  // Copy persona-based email to clipboard
  const copyPersonaEmail = (response: OnboardingResponse) => {
    const email = generatePersonaEmail(response);
    const fullEmail = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Personalisert e-post kopiert til utklippstavle!');
  };

  // Open email client with persona-based email
  const openPersonaEmail = (response: OnboardingResponse) => {
    const email = generatePersonaEmail(response);
    const mailtoLink = `mailto:${response.email}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    window.location.href = mailtoLink;
  };

  const fetchResponses = async () => {
    try {
      setLoading(true);
      // Try RPC function first (bypasses RLS)
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_onboarding_responses');

      if (!rpcError && rpcData) {
        // Ensure all arrays are properly initialized
        const normalizedData = (rpcData as OnboardingResponse[]).map(response => ({
          ...response,
          goals: response.goals || [],
          current_usage_options: response.current_usage_options || [],
          pain_points_options: response.pain_points_options || [],
          current_usage: response.current_usage || '',
          pain_points: response.pain_points || '',
        }));
        setResponses(normalizedData);
        setLoading(false);
        return;
      }

      // Fallback to direct select (requires RLS policy)
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching responses:', error);
        console.error('RPC error:', rpcError);
        toast.error('Kunne ikke hente innsendinger. Sjekk at RPC-funksjonen er opprettet.');
        setResponses([]);
      } else {
        // Ensure all arrays are properly initialized
        const normalizedData = (data || []).map((response: OnboardingResponse) => ({
          ...response,
          goals: response.goals || [],
          current_usage_options: response.current_usage_options || [],
          pain_points_options: response.pain_points_options || [],
          current_usage: response.current_usage || '',
          pain_points: response.pain_points || '',
        }));
        setResponses(normalizedData);
      }
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast.error('Kunne ikke hente innsendinger');
      setResponses([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Dato',
      'Navn',
      'E-post',
      'Telefon',
      'Type',
      'Firmanavn',
      'Bransje',
      'Mål',
      'Nåværende bruk',
      'Bruksalternativer',
      'Utfordringer',
      'Utfordringsalternativer',
      'Samtykke'
    ];

    const rows = responses.map(response => [
      new Date(response.created_at).toLocaleString('no-NO'),
      response.name,
      response.email,
      response.phone || '',
      response.type === 'personal' ? 'Personlig' : 'Profesjonell',
      response.company_name || '',
      response.industry || '',
      (response.goals || []).join(', '),
      response.current_usage || '',
      (response.current_usage_options || []).join(', '),
      response.pain_points || '',
      (response.pain_points_options || []).join(', '),
      response.consent ? 'Ja' : 'Nei'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `onboarding_responses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV-fil lastet ned!');
  };

  const exportToEmailFormat = () => {
    const emailContent = responses.map(response => {
      const goals = response.goals || [];
      const currentUsageOptions = response.current_usage_options || [];
      const painPointsOptions = response.pain_points_options || [];
      
      return `--- NY INNSENDING ---
Dato: ${new Date(response.created_at).toLocaleString('no-NO')}
Navn: ${response.name}
E-post: ${response.email}
Telefon: ${response.phone || 'Ikke oppgitt'}
Type: ${response.type === 'personal' ? 'Personlig' : 'Profesjonell'}
${response.company_name ? `Firmanavn: ${response.company_name}\n` : ''}${response.industry ? `Bransje: ${response.industry}\n` : ''}Mål: ${goals.join(', ')}
Nåværende bruk: ${response.current_usage || 'Ikke oppgitt'}
${currentUsageOptions.length > 0 ? `Bruksalternativer: ${currentUsageOptions.join(', ')}\n` : ''}Utfordringer: ${response.pain_points || 'Ikke oppgitt'}
${painPointsOptions.length > 0 ? `Utfordringsalternativer: ${painPointsOptions.join(', ')}\n` : ''}Samtykke: ${response.consent ? 'Ja' : 'Nei'}

`;
    }).join('\n');

    const blob = new Blob([emailContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `onboarding_responses_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Tekstfil lastet ned!');
  };

  const copyEmailFormat = (response: OnboardingResponse) => {
    const emailContent = `--- NY INNSENDING ---
Dato: ${new Date(response.created_at).toLocaleString('no-NO')}
Navn: ${response.name}
E-post: ${response.email}
Telefon: ${response.phone || 'Ikke oppgitt'}
Type: ${response.type === 'personal' ? 'Personlig' : 'Profesjonell'}
${response.company_name ? `Firmanavn: ${response.company_name}\n` : ''}${response.industry ? `Bransje: ${response.industry}\n` : ''}Mål: ${response.goals.join(', ')}
Nåværende bruk: ${response.current_usage || 'Ikke oppgitt'}
${(response.current_usage_options || []).length > 0 ? `Bruksalternativer: ${(response.current_usage_options || []).join(', ')}\n` : ''}Utfordringer: ${response.pain_points || 'Ikke oppgitt'}
${(response.pain_points_options || []).length > 0 ? `Utfordringsalternativer: ${(response.pain_points_options || []).join(', ')}\n` : ''}Samtykke: ${response.consent ? 'Ja' : 'Nei'}`;

    navigator.clipboard.writeText(emailContent);
    toast.success('Kopiert til utklippstavle!');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Onboarding Inn sendinger</h2>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Download size={18} />
            <span>Eksporter CSV</span>
          </button>
          <button
            onClick={exportToEmailFormat}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileText size={18} />
            <span>Eksporter TXT</span>
          </button>
        </div>
      </div>

      {responses.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Ingen innsendinger å vise</p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Navn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response) => {
                  const isExpanded = expandedRows.has(response.id);
                  return (
                    <React.Fragment key={response.id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRowExpansion(response.id)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(response.created_at).toLocaleString('no-NO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {response.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a 
                            href={`mailto:${response.email}`} 
                            className="text-brand-600 hover:text-brand-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {response.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              response.type === 'professional' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {response.type === 'professional' ? 'Profesjonell' : 'Personlig'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs text-center ${
                              determinePersona(response).includes('beginner')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {determinePersona(response).includes('beginner') ? 'Nybegynner' : 'Erfaren'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openDetailModal(response)}
                              className="flex items-center gap-1 text-brand-600 hover:text-brand-700 px-2 py-1 rounded hover:bg-brand-50"
                            >
                              <Eye size={16} />
                              <span>Vis detaljer</span>
                            </button>
                            <button
                              onClick={() => copyEmailFormat(response)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50"
                              title="Kopier rådata"
                            >
                              <FileText size={16} />
                              <span>Rådata</span>
                            </button>
                            <button
                              onClick={() => copyPersonaEmail(response)}
                              className="flex items-center gap-1 text-brand-600 hover:text-brand-700 px-2 py-1 rounded hover:bg-brand-50"
                              title="Kopier personalisert e-post"
                            >
                              <Mail size={16} />
                              <span>E-post</span>
                            </button>
                            <button
                              onClick={() => toggleRowExpansion(response.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Kontaktinformasjon</h4>
                                <p><span className="font-medium">Navn:</span> {response.name}</p>
                                <p><span className="font-medium">E-post:</span> {response.email}</p>
                                {response.phone && <p><span className="font-medium">Telefon:</span> {response.phone}</p>}
                                {response.type === 'professional' && (
                                  <>
                                    {response.company_name && <p><span className="font-medium">Firmanavn:</span> {response.company_name}</p>}
                                    {response.industry && <p><span className="font-medium">Bransje:</span> {response.industry}</p>}
                                  </>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Mål</h4>
                                {response.goals && response.goals.length > 0 ? (
                                  <ul className="list-disc list-inside">
                                    {response.goals.map((goal, idx) => (
                                      <li key={idx}>{goal}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500">Ingen mål valgt</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Nåværende bruk</h4>
                                {response.current_usage_options && response.current_usage_options.length > 0 && (
                                  <div className="mb-2">
                                    <p className="font-medium mb-1">Valgte alternativer:</p>
                                    <ul className="list-disc list-inside">
                                      {response.current_usage_options.map((option, idx) => (
                                        <li key={idx}>{option}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {response.current_usage && (
                                  <div>
                                    <p className="font-medium mb-1">Fritekst:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{response.current_usage}</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Utfordringer</h4>
                                {response.pain_points_options && response.pain_points_options.length > 0 && (
                                  <div className="mb-2">
                                    <p className="font-medium mb-1">Valgte alternativer:</p>
                                    <ul className="list-disc list-inside">
                                      {response.pain_points_options.map((option, idx) => (
                                        <li key={idx}>{option}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {response.pain_points && (
                                  <div>
                                    <p className="font-medium mb-1">Fritekst:</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{response.pain_points}</p>
                                  </div>
                                )}
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">Samtykke:</span> {response.consent ? 'Ja' : 'Nei'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detaljer for {selectedResponse.name}
                </h3>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Kontaktinformasjon */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">Kontaktinformasjon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Navn</p>
                      <p className="font-medium">{selectedResponse.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">E-post</p>
                      <a href={`mailto:${selectedResponse.email}`} className="font-medium text-brand-600 hover:text-brand-700">
                        {selectedResponse.email}
                      </a>
                    </div>
                    {selectedResponse.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <p className="font-medium">{selectedResponse.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        selectedResponse.type === 'professional' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedResponse.type === 'professional' ? 'Profesjonell' : 'Personlig'}
                      </span>
                    </div>
                    {selectedResponse.type === 'professional' && (
                      <>
                        {selectedResponse.company_name && (
                          <div>
                            <p className="text-sm text-gray-500">Firmanavn</p>
                            <p className="font-medium">{selectedResponse.company_name}</p>
                          </div>
                        )}
                        {selectedResponse.industry && (
                          <div>
                            <p className="text-sm text-gray-500">Bransje</p>
                            <p className="font-medium">{selectedResponse.industry}</p>
                          </div>
                        )}
                      </>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Innsendt</p>
                      <p className="font-medium">
                        {new Date(selectedResponse.created_at).toLocaleString('no-NO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mål */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">Mål</h4>
                  {selectedResponse.goals && selectedResponse.goals.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedResponse.goals.map((goal, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Ingen mål valgt</p>
                  )}
                </div>

                {/* Nåværende bruk */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">Nåværende bruk</h4>
                  {selectedResponse.current_usage_options && selectedResponse.current_usage_options.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Valgte alternativer:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedResponse.current_usage_options.map((option, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedResponse.current_usage && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Fritekst:</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedResponse.current_usage}</p>
                      </div>
                    </div>
                  )}
                  {(!selectedResponse.current_usage_options || selectedResponse.current_usage_options.length === 0) && !selectedResponse.current_usage && (
                    <p className="text-gray-500">Ingen informasjon oppgitt</p>
                  )}
                </div>

                {/* Utfordringer */}
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">Utfordringer</h4>
                  {selectedResponse.pain_points_options && selectedResponse.pain_points_options.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Valgte alternativer:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedResponse.pain_points_options.map((option, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedResponse.pain_points && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Fritekst:</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedResponse.pain_points}</p>
                      </div>
                    </div>
                  )}
                  {(!selectedResponse.pain_points_options || selectedResponse.pain_points_options.length === 0) && !selectedResponse.pain_points && (
                    <p className="text-gray-500">Ingen informasjon oppgitt</p>
                  )}
                </div>

                {/* Samtykke */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Samtykke:</span>{' '}
                    <span className={selectedResponse.consent ? 'text-green-600' : 'text-red-600'}>
                      {selectedResponse.consent ? 'Ja' : 'Nei'}
                    </span>
                  </p>
                </div>

                {/* Persona Info */}
                <div className="bg-brand-50 rounded-lg p-4 border border-brand-200">
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">Kunde Persona</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      determinePersona(selectedResponse).includes('beginner')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {determinePersona(selectedResponse).includes('beginner') ? '🆕 Nybegynner' : '⭐ Erfaren'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      selectedResponse.type === 'professional' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedResponse.type === 'professional' ? '💼 Profesjonell' : '👤 Personlig'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Persona: <span className="font-medium">{determinePersona(selectedResponse)}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      copyPersonaEmail(selectedResponse);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    <Mail size={18} />
                    <span>Kopier personalisert e-post</span>
                  </button>
                  <button
                    onClick={() => {
                      openPersonaEmail(selectedResponse);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail size={18} />
                    <span>Åpne i e-postklient</span>
                  </button>
                  <button
                    onClick={() => {
                      copyEmailFormat(selectedResponse);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FileText size={18} />
                    <span>Kopier rådata</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

