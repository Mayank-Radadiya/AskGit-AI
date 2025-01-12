import { useQueryClient } from "@tanstack/react-query";

export const useReFetch = () => {
   const queryClient = useQueryClient();

   return async () => {
      await queryClient.refetchQueries({
         type: "active",
      });
   };
};
