import { Video } from '@/utils/videos';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(video.url);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/default-thumbnail.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video w-full">
        <img
          src={thumbnailUrl}
          alt={`Miniatura de ${video.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{video.title}</h3>
        <p className="text-gray-600 mb-2">{video.author}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          {video.duration && <span>{video.duration}</span>}
          {video.language && <span>· {video.language}</span>}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{video.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {video.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full text-center py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Ver Video
        </a>
      </div>
    </div>
  );
}