import { useState } from 'react';
import { X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100"
        >
          <X size={24} />
        </button>
        <div className="p-1">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={video.videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{video.title}</h3>
            <p className="text-gray-600">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Example videos - replace with your actual video data
  const videos: Video[] = [
    {
      id: '1',
      title: 'Sommerkonsert 2023',
      description: 'Høydepunkter fra vår fantastiske sommerkonsert i Hovden.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/your-video-id'
    },
    {
      id: '2',
      title: 'Jazz i fjellet',
      description: 'En magisk kveld med jazz og god stemning.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/embed/your-video-id'
    },
    // Add more videos as needed
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{video.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
} 