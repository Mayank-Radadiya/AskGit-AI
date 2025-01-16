import { db } from "@/server/db";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FC } from "react";
import { toast } from "sonner";

const page: FC = async () => {
  const { userId } = await auth();
  if (!userId) {
    toast("Something went Wrong, Try again");
    redirect("sign-in");
  }

  const client = await clerkClient();

  const user = await client.users.getUser(userId);
  if (!user) {
    toast("Something went Wrong, Try again");
    redirect("sign-in");
  }

  await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  return redirect("/dashboard");
};

export default page;
