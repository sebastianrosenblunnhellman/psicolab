export const metadata = {
  title: 'Recursos - Psicolab',
  description: 'Explora nuestra biblioteca de recursos de psicología',
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  );
}
