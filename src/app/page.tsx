import { SignOut } from "@/components/sign-out";
import { auth } from "@/lib/auth";
import db from "@/lib/db/db";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  console.log(session);
  if (!session) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: {
      email: "darren94me@gmail.com",
    },
  });
  console.log("user", user);

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600">Signed in as:</p>
        <p className="font-medium">{session.user?.email}</p>
      </div>

      <SignOut />
    </>
  );
};

export default Page;
