import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Mail, Trash2, Edit2, X, Save } from 'lucide-react';

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

export function MembershipManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Application>>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
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
  };

  const updateApplicationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status oppdatert');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Kunne ikke oppdatere status');
    }
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('Er du sikker på at du vil slette dette medlemmet?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('membership_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Medlem slettet');
      fetchApplications();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Kunne ikke slette medlem');
    }
  };

  const handleEdit = (application: Application) => {
    setEditingMember(application.id);
    setEditForm(application);
  };

  const saveEdit = async () => {
    if (!editingMember || !editForm) return;

    try {
      const { error } = await supabase
        .from('membership_applications')
        .update(editForm)
        .eq('id', editingMember);

      if (error) throw error;
      toast.success('Medlem oppdatert');
      setEditingMember(null);
      fetchApplications();
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Kunne ikke oppdatere medlem');
    }
  };

  const handleEmailClick = (email: string, name: string) => {
    const mailtoLink = `mailto:${email}?subject=Hovden Musikklubb - Medlemskap`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medlemssøknader</h2>
      </div>

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
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Laster søknader...</p>
        </div>
      ) : applications.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Ingen søknader å vise</p>
      ) : (
        <div className="grid gap-6">
          {applications
            .filter(app => selectedStatus === 'all' || app.status === selectedStatus)
            .map(application => (
              <div key={application.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                {editingMember === application.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">Rediger medlem</h3>
                      <button
                        onClick={() => setEditingMember(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Navn</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input
                          type="text"
                          value={editForm.phone || ''}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bosted</label>
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Aldersgruppe</label>
                        <input
                          type="text"
                          value={editForm.age_group || ''}
                          onChange={e => setEditForm({ ...editForm, age_group: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Medlemstype</label>
                        <select
                          value={editForm.member_type || 'local'}
                          onChange={e => setEditForm({ ...editForm, member_type: e.target.value as 'local' | 'casual' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="local">Lokal</option>
                          <option value="casual">Tilreisende</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Musikksjangre</label>
                      <input
                        type="text"
                        value={editForm.music_genres?.join(', ') || ''}
                        onChange={e => setEditForm({ ...editForm, music_genres: e.target.value.split(',').map(g => g.trim()) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivasjon</label>
                      <textarea
                        value={editForm.motivation || ''}
                        onChange={e => setEditForm({ ...editForm, motivation: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                      >
                        <Save size={16} />
                        <span>Lagre endringer</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{application.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <p>{application.email}</p>
                          <button
                            onClick={() => handleEmailClick(application.email, application.name)}
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                          >
                            <Mail size={16} />
                            <span>Send e-post</span>
                          </button>
                          <button
                            onClick={() => handleEdit(application)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700"
                          >
                            <Edit2 size={16} />
                            <span>Rediger</span>
                          </button>
                          <button
                            onClick={() => deleteMember(application.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                            <span>Slett</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(application.created_at).toLocaleDateString('no-NO', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <select
                        value={application.status}
                        onChange={e => updateApplicationStatus(application.id, e.target.value as 'pending' | 'approved' | 'rejected')}
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
                      <div>
                        <p className="text-gray-500">Medlemstype</p>
                        <p>{application.member_type === 'local' ? 'Lokal' : 'Tilreisende'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500">Musikksjangre</p>
                        <p>{application.music_genres.join(', ')}</p>
                      </div>
                      {application.motivation && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Motivasjon</p>
                          <p className="whitespace-pre-wrap">{application.motivation}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
} 