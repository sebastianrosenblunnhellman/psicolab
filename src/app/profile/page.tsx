import { auth } from "@/auth";
import { getProfile } from "@/actions/profile-actions";
import ProfileForm from "@/components/ProfileForm";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Configuración de Perfil
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gestiona tu información personal y preferencias.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
             <ProfileForm initialData={profile} userEmail={session.user.email || ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
