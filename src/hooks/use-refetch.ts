import { useQueryClient } from "@tanstack/react-query";

export const useReFetch = (queryKeys?: string[]) => {
   const queryClient = useQueryClient();

   return async () => {
      try {
         if (queryKeys && queryKeys.length > 0) {
            // Refetch specific queries
            await Promise.all(
               queryKeys.map((key) =>
                  queryClient.refetchQueries({
                     queryKey: [key],
                     type: "active",
                  }),
               ),
            );
         } else {
            // Refetch all active queries if no keys are provided
            await queryClient.refetchQueries({ type: "active" });
         }
      } catch (error) {
         console.error("Error during refetch:", error);
      }
   };
};
