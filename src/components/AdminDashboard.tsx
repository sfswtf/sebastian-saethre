import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { ManualMemberAdd } from './ManualMemberAdd';
import { EventManager } from './admin/EventManager';
import { AboutEditor } from './admin/AboutEditor';
import { SocialMediaManager } from './admin/SocialMediaManager';
import { ContactMessages } from './admin/ContactMessages';
import PageContentManager from './admin/PageContentManager';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  age_group: string;
  music_genres: string[];
  motivation: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  location: string;
  member_type: 'local' | 'casual';
}

interface GroupedMembers {
  ageGroup: string;
  genres: string[];
  members: Application[];
}

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'about' | 'messages' | 'members' | 'social'>('events');

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Kunne ikke hente søknader');
    } finally {
      setLoading(false);
    }
  }

  async function updateApplicationStatus(id: string, newStatus: string) {
    try {
      console.log('Updating status:', { id, newStatus });
      
      const { data, error } = await supabase
        .from('membership_applications')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating status:', error);
        toast.error(`Kunne ikke oppdatere status: ${error.message}`);
        throw error;
      }

      console.log('Update response:', data);
      toast.success('Status oppdatert');
      await fetchApplications();
    } catch (error) {
      console.error('Error in updateApplicationStatus:', error);
      toast.error('Kunne ikke oppdatere status');
    }
  }

  async function updateMemberType(id: string, newType: 'local' | 'casual') {
    try {
      console.log('Updating member type:', { id, newType });
      
      const { data, error } = await supabase
        .from('membership_applications')
        .update({ member_type: newType })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating member type:', error);
        toast.error(`Kunne ikke oppdatere medlemstype: ${error.message}`);
        throw error;
      }

      console.log('Update response:', data);
      toast.success('Medlemstype oppdatert');
      await fetchApplications();
    } catch (error) {
      console.error('Error in updateMemberType:', error);
      toast.error('Kunne ikke oppdatere medlemstype');
    }
  }

  // Group members by age and music preferences
  const groupMembers = (members: Application[]): GroupedMembers[] => {
    const groups: { [key: string]: Application[] } = {};
    
    members.forEach(member => {
      if (member.status !== 'approved') return;
      
      member.music_genres.forEach(genre => {
        const key = `${member.age_group}-${genre}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(member);
      });
    });

    return Object.entries(groups)
      .filter(([_, members]) => members.length >= 2) // Only groups with 2 or more members
      .map(([key, members]) => {
        const [ageGroup, ...genres] = key.split('-');
        return {
          ageGroup,
          genres,
          members
        };
      })
      .sort((a, b) => b.members.length - a.members.length);
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent || selectedEmails.length === 0) {
      toast.error('Fyll ut alle feltene og velg mottakere');
      return;
    }

    // Here you would integrate with your email service
    // For now, we'll just show a success message
    toast.success(`Email vil bli sendt til ${selectedEmails.length} medlemmer`);
    setShowEmailForm(false);
    setEmailSubject('');
    setEmailContent('');
    setSelectedEmails([]);
  };

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  const groupedMembers = groupMembers(applications);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            <button
              onClick={() => setActiveTab('events')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-[#1d4f4d] text-[#1d4f4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Arrangementer
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-[#1d4f4d] text-[#1d4f4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meldinger
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-[#1d4f4d] text-[#1d4f4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medlemmer
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'social'
                  ? 'border-[#1d4f4d] text-[#1d4f4d]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sosiale Medier
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'events' && <EventManager />}
          {activeTab === 'messages' && <ContactMessages />}
          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Medlemssøknader</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="bg-[#1d4f4d] text-white px-4 py-2 rounded-md hover:bg-[#2a6f6d]"
                  >
                    Legg til medlem
                  </button>
                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="bg-[#1d4f4d] text-white px-4 py-2 rounded-md hover:bg-[#2a6f6d]"
                  >
                    Send Email
                  </button>
                </div>
              </div>

              {showAddMember && (
                <ManualMemberAdd onMemberAdded={() => {
                  setShowAddMember(false);
                  fetchApplications();
                }} />
              )}

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStatus === 'all'
                      ? 'bg-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Alle
                </button>
                <button
                  onClick={() => setSelectedStatus('pending')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStatus === 'pending'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  Venter
                </button>
                <button
                  onClick={() => setSelectedStatus('approved')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStatus === 'approved'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  Godkjent
                </button>
                <button
                  onClick={() => setSelectedStatus('rejected')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedStatus === 'rejected'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  Avvist
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1d4f4d] border-r-transparent"></div>
                  <p className="mt-2 text-gray-500">Laster søknader...</p>
                </div>
              ) : applications.length === 0 ? (
                <p className="text-center py-12 text-gray-500">
                  Ingen søknader å vise
                </p>
              ) : (
                <div className="grid gap-6">
                  {applications
                    .filter(
                      app =>
                        selectedStatus === 'all' ||
                        app.status === selectedStatus
                    )
                    .map(application => (
                      <div
                        key={application.id}
                        className="bg-white rounded-lg shadow-sm p-6 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {application.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {application.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(
                                application.created_at
                              ).toLocaleDateString('no-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <select
                            value={application.status}
                            onChange={e =>
                              updateApplicationStatus(
                                application.id,
                                e.target.value
                              )
                            }
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              application.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            <option value="pending">Venter</option>
                            <option value="approved">Godkjent</option>
                            <option value="rejected">Avvist</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Telefon</p>
                            <p>{application.phone || 'Ikke oppgitt'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Aldersgruppe</p>
                            <p>{application.age_group}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Bosted</p>
                            <p>{application.location}</p>
                          </div>
                          {application.status === 'approved' && (
                            <div>
                              <p className="text-gray-500">Medlemstype</p>
                              <select
                                value={application.member_type}
                                onChange={(e) => updateMemberType(application.id, e.target.value as 'local' | 'casual')}
                                className="mt-1 text-sm rounded-md border-gray-300 focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                              >
                                <option value="local">Lokal</option>
                                <option value="casual">Tilreisende</option>
                              </select>
                            </div>
                          )}
                          <div className="col-span-2">
                            <p className="text-gray-500">Musikksjangre</p>
                            <p>{application.music_genres.join(', ')}</p>
                          </div>
                          {application.motivation && (
                            <div className="col-span-2">
                              <p className="text-gray-500">Motivasjon</p>
                              <p className="whitespace-pre-wrap">
                                {application.motivation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'social' && <SocialMediaManager />}
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Send Email til Medlemmer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Emne
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Melding
                </label>
                <textarea
                  value={emailContent}
                  onChange={e => setEmailContent(e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1d4f4d] focus:ring-[#1d4f4d]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velg mottakere
                </label>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {applications
                    .filter(app => app.status === 'approved')
                    .map(app => (
                      <label key={app.id} className="flex items-center p-1">
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(app.email)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedEmails([...selectedEmails, app.email]);
                            } else {
                              setSelectedEmails(
                                selectedEmails.filter(
                                  email => email !== app.email
                                )
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        {app.name} ({app.email})
                      </label>
                    ))}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-[#1d4f4d] text-white rounded-md hover:bg-[#2a6f6d]"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
} 