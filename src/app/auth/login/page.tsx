import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

const LoginPage = () => {

  return (
    <main className="w-full h-screen ">
      <div className="flex justify-around items-center h-full max-w-7xl mx-auto">

        <section className="min-w-1/4 flex space-y-6 items-center justify-center " >
          <LoginForm />
        </section>
        {/* Image section */}
        <section className="w-[500px] h-[500px] hidden lg:block">
          <Image src="/images/login.svg" alt="login" height={500} width={500} priority />
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
