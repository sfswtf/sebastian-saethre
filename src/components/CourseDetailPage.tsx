import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedButton } from './animations/AnimatedButton';
import { useLanguageStore } from '../stores/languageStore';
import { LocalStorageService } from '../lib/localStorage';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Clock, Users, CheckCircle } from 'lucide-react';

interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  course_image: string | null;
  status: 'draft' | 'published';
  created_at?: string;
  content?: string;
  duration?: string;
  level?: string;
  lessons?: number;
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (error) throw error;

        if (data) {
          setCourse(data as Course);
        } else {
          // Fallback to localStorage
          const allCourses = LocalStorageService.get<Course>('courses');
          const foundCourse = allCourses.find(c => c.id === id && c.status === 'published');
          setCourse(foundCourse || null);
        }
      } catch (error) {
        console.warn('Supabase fetch failed, using localStorage:', error);
        // Fallback to localStorage
        try {
          const allCourses = LocalStorageService.get<Course>('courses');
          const foundCourse = allCourses.find(c => c.id === id && c.status === 'published');
          setCourse(foundCourse || null);
        } catch (localError) {
          console.error('Error fetching course:', localError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (!course) {
    return (
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-neutral-900">{t('courses.notFound')}</h1>
            <p className="text-neutral-600 mb-8">{t('courses.notFoundDesc')}</p>
            <Link to="/courses">
              <AnimatedButton variant="primary" className="bg-brand-600 text-white hover:bg-brand-700">
                {t('courses.backToCourses')}
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/courses"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('courses.backToCourses')}</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {course.course_image && (
            <img 
              src={course.course_image} 
              alt={course.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              {course.duration && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Clock size={18} />
                  <span className="text-sm">{course.duration}</span>
                </div>
              )}
              {course.lessons && (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Users size={18} />
                  <span className="text-sm">{course.lessons} {t('courses.lessons')}</span>
                </div>
              )}
              {course.level && (
                <span className="text-sm bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-semibold">
                  {course.level}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              {course.title}
            </h1>

            <p className="text-xl text-neutral-700 mb-8 leading-relaxed">
              {course.description}
            </p>

            {course.content && (
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {course.content}
                </div>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-8 mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-3xl font-bold text-brand-600 mb-2">
                    {course.price === 0 ? t('courses.free') : `${course.price} ${course.currency}`}
                  </div>
                  {course.price === 0 && (
                    <p className="text-sm text-neutral-600">{t('courses.freeCourse')}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <Link to="/onboarding">
                    <AnimatedButton
                      variant="primary"
                      className="bg-brand-600 text-white hover:bg-brand-700 px-8 py-3"
                    >
                      {t('courses.enrollNow')}
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

