import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/github";
import { Google } from "./ui/google";

const GoogleSignIn = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button className="w-full" variant="outline">
        <Google />
        Continue with Google
      </Button>
    </form>
  );
};

export { GoogleSignIn };
