import { useState, useEffect } from 'react';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedCard } from './animations/AnimatedCard';
import { AnimatedText } from './animations/AnimatedText';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';

interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  course_image: string | null;
  status: 'draft' | 'published';
  created_at?: string;
}

export function CoursesPage() {
  const { t } = useLanguageStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setCourses(data as Course[]);
        } else {
          // Fallback to localStorage
          const allCourses = LocalStorageService.get<Course>('courses');
          const published = allCourses.filter(course => course.status === 'published');
          setCourses(published.sort((a, b) => 
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          ));
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allCourses = LocalStorageService.get<Course>('courses');
          const published = allCourses.filter(course => course.status === 'published');
          setCourses(published.sort((a, b) => 
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          ));
        } catch (localError) {
          console.error('Error fetching courses:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <AnimatedText text={t('courses.title')} className="text-4xl font-bold mb-4 text-neutral-900" />
          <AnimatedText 
            text={t('courses.description')}
            className="text-lg text-neutral-600 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
        
        {courses.length === 0 ? (
          <AnimatedCard className="p-12 text-center">
            <p className="text-neutral-500 text-lg">
              {t('courses.comingSoon')}
            </p>
          </AnimatedCard>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block"
              >
                <AnimatedCard className="overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] flex flex-col h-full cursor-pointer group">
                  {course.course_image && (
                    <img 
                      src={course.course_image} 
                      alt={course.title}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 group-hover:text-brand-600 transition-colors">{course.title}</h3>
                    <div 
                      className="text-neutral-600 mb-6 line-clamp-4 flex-grow prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                    <div className="flex items-center gap-6 mb-6 text-sm text-neutral-500">
                      {(course as any).duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{(course as any).duration}</span>
                        </div>
                      )}
                      {(course as any).lessons && (
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{(course as any).lessons} {t('courses.lessons')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-auto">
                      <span className="text-2xl font-bold text-brand-600">
                        {course.price === 0 ? t('courses.free') : `${course.price} ${course.currency}`}
                      </span>
                      <span className="inline-flex items-center gap-2 text-brand-600 group-hover:text-brand-700 font-semibold text-base">
                        {t('courses.viewCourse')} →
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

