import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  // Auth disabled
  // const session = await authServer.getSession()
  
  // if (!session?.user) {
  //   redirect("/login")
  // }

  // const userData = await prisma.userData.findUnique({
  //   where: { userId: session.user.id }
  // })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Mi Perfil</h1>
      <p>La autenticación está temporalmente deshabilitada.</p>
      {/* <ProfileForm user={session.user} userData={userData} /> */}
    </div>
  )
}