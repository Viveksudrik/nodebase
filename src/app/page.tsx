import {getQueryClient, trpc} from "@/trpc/server";
import {Client} from "./client";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

const page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return(
   <div className="min-h-screen flex items-center 
   justify-center text-red-300">

    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client />
    </HydrationBoundary>

  </div>
  )
};

export default page; 
 