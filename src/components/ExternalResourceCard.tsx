{/* Previous imports remain the same */}

export default function ExternalResourceCard({ resource }: ExternalResourceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{resource.title}</h3>
          <span className="text-sm text-gray-500">{resource.type}</span>
        </div>

        <p className="text-gray-600 mb-4">{resource.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
            >
              <FaTag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <span>{resource.author}</span>
          <span>{resource.language}</span>
        </div>

        <Link
          href={`/materiales/recursos-externos/${resource.slug}`}
          className="inline-flex items-center justify-center w-full gap-2 py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          Ver Recurso
        </Link>
      </div>
    </div>
  );
}