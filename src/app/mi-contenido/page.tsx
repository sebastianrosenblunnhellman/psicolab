import { auth } from "@/auth";
import { getUserLikes } from "@/actions/content-actions";
import Link from "next/link";
import { FaBook, FaTools, FaHeart } from "react-icons/fa";
import { redirect } from "next/navigation";
import RemoveSavedItemButton from "@/components/RemoveSavedItemButton";

export default async function MyContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const likes = await getUserLikes();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Contenido Guardado</h1>

        {likes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <FaHeart className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes contenido guardado</h3>
            <p className="mt-1 text-sm text-gray-500">Dale "Me gusta" a los artículos y materiales para encontrarlos aquí.</p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/articulos"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
              >
                Explorar Blog
              </Link>
              <Link
                href="/recursos"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-accent-700 bg-accent-100 hover:bg-accent-200"
              >
                Explorar Materiales
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {likes.map((like) => {
              // Determine if it's an article or material
              const item = like.article || like.material;
              const type = like.article ? 'article' : 'material'; // 'article' | 'material' for the action
              const typeLabel = like.article ? 'Artículo' : 'Material';
              const href = like.article ? `/articulos/${like.article.slug}` : `/recursos/${like.material!.slug}`; // Assuming resource URL structure
              const Icon = like.article ? FaBook : FaTools;

              if (!item) return null;

              return (
                <Link key={like.id} href={href} className="block group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          typeLabel === 'Artículo' ? 'bg-primary-100 text-primary-800' : 'bg-accent-100 text-accent-800'
                        }`}>
                          {typeLabel}
                        </span>
                        <RemoveSavedItemButton 
                            slug={item.slug} 
                            title={item.title} 
                            type={type} 
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto pt-4">
                        <Icon className="h-4 w-4" />
                        <span>Ver contenido</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
