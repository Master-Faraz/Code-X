import Image from 'next/image';

const ForgotPassword = () => {
  return (
    <main className="flex justify-around w-full h-screen items-center ">
      <section>Reset Your password</section>
      <section className="w-[500px] h-[500px]  hidden lg:block">
        <Image src="/images/forgot-password.svg" alt="Forgot password illustration" height={500} width={500} priority />
      </section>
    </main>
  );
};

export default ForgotPassword;
