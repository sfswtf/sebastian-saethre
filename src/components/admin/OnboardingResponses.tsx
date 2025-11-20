import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, Mail, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

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

export function OnboardingResponses() {
  const [responses, setResponses] = useState<OnboardingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast.error('Kunne ikke hente innsendinger');
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
      response.goals.join(', '),
      response.current_usage,
      response.current_usage_options.join(', '),
      response.pain_points,
      response.pain_points_options.join(', '),
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
      return `--- NY INNSENDING ---
Dato: ${new Date(response.created_at).toLocaleString('no-NO')}
Navn: ${response.name}
E-post: ${response.email}
Telefon: ${response.phone || 'Ikke oppgitt'}
Type: ${response.type === 'personal' ? 'Personlig' : 'Profesjonell'}
${response.company_name ? `Firmanavn: ${response.company_name}\n` : ''}${response.industry ? `Bransje: ${response.industry}\n` : ''}Mål: ${response.goals.join(', ')}
Nåværende bruk: ${response.current_usage || 'Ikke oppgitt'}
${response.current_usage_options.length > 0 ? `Bruksalternativer: ${response.current_usage_options.join(', ')}\n` : ''}Utfordringer: ${response.pain_points || 'Ikke oppgitt'}
${response.pain_points_options.length > 0 ? `Utfordringsalternativer: ${response.pain_points_options.join(', ')}\n` : ''}Samtykke: ${response.consent ? 'Ja' : 'Nei'}

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
${response.current_usage_options.length > 0 ? `Bruksalternativer: ${response.current_usage_options.join(', ')}\n` : ''}Utfordringer: ${response.pain_points || 'Ikke oppgitt'}
${response.pain_points_options.length > 0 ? `Utfordringsalternativer: ${response.pain_points_options.join(', ')}\n` : ''}Samtykke: ${response.consent ? 'Ja' : 'Nei'}`;

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
                {responses.map((response) => (
                  <tr key={response.id} className="hover:bg-gray-50">
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
                      <a href={`mailto:${response.email}`} className="text-brand-600 hover:text-brand-700">
                        {response.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        response.type === 'professional' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {response.type === 'professional' ? 'Profesjonell' : 'Personlig'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => copyEmailFormat(response)}
                        className="flex items-center gap-1 text-brand-600 hover:text-brand-700"
                      >
                        <Mail size={16} />
                        <span>Kopier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

