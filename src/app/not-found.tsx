import Image from 'next/image';

const notFound = () => {
  return (
    <main className="flex justify-around w-full h-screen items-center ">
      <Image src="/images/not-found.svg" alt="Forgot password illustration" height={500} width={500} priority />
    </main>
  );
};

export default notFound;
