
import { Toaster } from '@/components/ui/sonner';

const layout = ({ children }: { children: React.ReactNode }) => {



    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-full h-full bg-background">
                {children}
            </div>
            <Toaster position="top-right" richColors />
        </div>
    );
};

export default layout;
