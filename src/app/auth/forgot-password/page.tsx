import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Image from 'next/image';

const ForgotPassword = () => {
  return (
    <main className="w-full h-screen ">
      <div className="flex justify-around items-center h-full max-w-7xl mx-auto ">

        <section className="min-w-1/4 flex space-y-6 items-center justify-center ">
          <ResetPasswordForm />
        </section>

        {/* Image section */}
        <section className="w-[500px] h-[500px] hidden lg:block ">
          <Image
            src="/images/forgot-password.svg"
            alt="Forgot password illustration"
            height={500}
            width={500}
            priority
          />
        </section>

      </div>
    </main>
  );
};


export default ForgotPassword;
