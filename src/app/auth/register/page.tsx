import RegisterForm from "@/components/auth/RegisterForm";
import Image from "next/image";

const Register = () => {

  return (
    <main className="w-full h-screen ">
      <div className="flex justify-around items-center h-full max-w-7xl mx-auto">

        <section className="min-w-1/4 flex items-center justify-center  mt-10 " >
          <RegisterForm />
        </section>
        {/* Image section */}
        <section className="w-[500px] h-[500px] hidden lg:block">
          <Image src="/images/signup.svg" alt="Signup illustration" height={500} width={500} priority />

        </section>
      </div>
    </main>

  );
};

export default Register;
