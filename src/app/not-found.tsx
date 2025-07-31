import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex flex-col-reverse lg:flex-row items-center justify-center w-full h-screen px-4 py-8 text-center lg:text-left space-y-8 lg:space-y-0 lg:space-x-12">
      {/* Text Section */}
      <section className="max-w-md space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Lost in Space?</h1>
        <p className="text-gray-600 text-base md:text-lg">
          The page you’re looking for doesn’t exist or has been moved. Let’s get you back on track.
        </p>
        <Link href="/">
          <Button className="w-full sm:w-auto">Go to Home</Button>
        </Link>
      </section>

      {/* Image Section */}
      <section className="w-full max-w-sm lg:max-w-md">
        <Image src="/images/not-found.svg" alt="Page not found illustration" width={500} height={500} priority className="w-full h-auto" />
      </section>
    </main>
  );
};

export default NotFound;
