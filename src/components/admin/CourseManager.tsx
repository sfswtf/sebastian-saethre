import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '../../stores/languageStore';
import { LocalStorageService } from '../../lib/localStorage';
import { supabase } from '../../lib/supabase';

interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  course_image: string | null;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

export function CourseManager() {
  const { t } = useLanguageStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '',
    price: 0,
    currency: 'NOK',
    course_image: null,
    status: 'draft',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setCourses(data as Course[]);
      } else {
        const localData = LocalStorageService.get<Course>('courses');
        setCourses(localData.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      }
    } catch (error) {
      console.warn('Supabase fetch failed, using localStorage:', error);
      try {
        const data = LocalStorageService.get<Course>('courses');
        setCourses(data.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        ));
      } catch (localError) {
        console.error('Error fetching courses:', localError);
        toast.error('Kunne ikke hente kurs');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Debug: Log current state
    console.log('Submitting course:', {
      editingCourse: editingCourse?.id,
      formData,
      isEditing: !!editingCourse?.id,
    });
    
    try {
      if (editingCourse?.id) {
        // Update existing course
        console.log('Updating course:', editingCourse.id);
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);
        if (error) throw error;
        toast.success('Kurs oppdatert');
      } else {
        // Insert new course
        console.log('Creating new course');
        const { error } = await supabase
          .from('courses')
          .insert([formData]);
        if (error) throw error;
        toast.success('Kurs opprettet');
      }
      
      // Clear form and refresh
      resetForm();
      fetchCourses();
    } catch (error: any) {
      console.warn('Supabase save failed, using localStorage:', error);
      try {
        if (editingCourse?.id) {
          LocalStorageService.update('courses', editingCourse.id, formData);
          toast.success('Kurs oppdatert (lokal lagring)');
        } else {
          LocalStorageService.add('courses', formData);
          toast.success('Kurs opprettet (lokal lagring)');
        }
        resetForm();
        fetchCourses();
      } catch (localError) {
        console.error('Error saving course:', localError);
        toast.error('Kunne ikke lagre kurs');
      }
    }
  }

  function resetForm() {
    // Clear editing state FIRST
    setEditingCourse(null);
    // Then reset form data
    setFormData({
      title: '',
      description: '',
      price: 0,
      currency: 'NOK',
      course_image: null,
      status: 'draft',
    });
  }

  function handleEdit(course: Course) {
    // Set editing course and form data
    setEditingCourse(course);
    setFormData({
      ...course,
      // Ensure all fields are set
      title: course.title || '',
      description: course.description || '',
      price: course.price || 0,
      currency: course.currency || 'NOK',
      course_image: course.course_image || null,
      status: course.status || 'draft',
    });
  }
  
  function handleNewCourse() {
    // Explicitly clear editing state for new course
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på at du vil slette dette kurset?')) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Kurs slettet');
      fetchCourses();
    } catch (error: any) {
      console.warn('Supabase delete failed, using localStorage:', error);
      try {
        LocalStorageService.delete('courses', id);
        toast.success('Kurs slettet (lokal lagring)');
        fetchCourses();
      } catch (localError) {
        console.error('Error deleting course:', localError);
        toast.error('Kunne ikke slette kurs');
      }
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.courses')}</h2>
        <button
          onClick={handleNewCourse}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          {t('common.create')} {t('admin.courses')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tittel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Beskrivelse</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pris</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valuta</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
            >
              <option value="NOK">NOK</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="FREE">Gratis</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kursbilde-URL</label>
          <input
            type="url"
            value={formData.course_image || ''}
            onChange={(e) => setFormData({ ...formData, course_image: e.target.value || null })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary-600"
          >
            <option value="draft">Draft</option>
            <option value="published">Publisert</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
          >
            {editingCourse ? t('common.save') : t('common.create')}
          </button>
          {editingCourse && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-neutral-200 px-6 py-2 rounded-md hover:bg-neutral-300"
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Tittel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Pris</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-neutral-500">
                  Ingen kurs ennå
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.currency === 'FREE' ? 'Gratis' : `${course.price} ${course.currency}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => course.id && handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

