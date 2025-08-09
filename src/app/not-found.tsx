import Image from "next/image";

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '5rem' }}>
      <Image
        src="/assets/404.png"
        alt="404 Not Found"
        width={1000}
        height={1000}
        style={{ margin: '0 auto' }}
      />
      <h1 className="text-white">404 - Page Not Found</h1>
      <p className="text-white">Looks like you took a wrong turn — pop back to the homepage.</p>
    </main>
  );
}
