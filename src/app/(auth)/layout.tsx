import { Meteors } from "@/components/ui/meteors";
import { FC } from "react";

interface layoutProps {
   children?: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
   return (
      <div className="flex min-h-screen flex-col items-center justify-center">
         <Meteors number={40} />
         {children}
      </div>
   );
};

export default layout;
