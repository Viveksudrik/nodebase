import { db as prisma } from "@/lib/db"

const page = async () => {
  const users = await prisma.user.findMany();
  console.log(users);
  return(
   <div className="min-h-screen flex items-center 
   justify-center text-red-300">

    {JSON.stringify(users)}
  </div>
  )
};

export default page; 
