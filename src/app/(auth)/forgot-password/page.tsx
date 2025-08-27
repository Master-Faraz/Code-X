import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Image from 'next/image';

const ForgotPassword = () => {
  return (
    <main className="flex justify-around w-full h-screen items-center ">
      <section className="min-w-1/4 flex flex-col space-y-6 items-center justify-center">
        {/* <h3 className="font-bold text-2xl"></h3> */}
        <ResetPasswordForm />
      </section>

      {/* Image section */}
      <section className="w-[500px] h-[500px]  hidden lg:block">
        <Image src="/images/forgot-password.svg" alt="Forgot password illustration" height={500} width={500} priority />
      </section>
    </main>
  );
};

export default ForgotPassword;
