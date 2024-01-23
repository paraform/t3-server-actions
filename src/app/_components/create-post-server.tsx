import { api } from "@/trpc/caller";
import { revalidatePath } from "next/cache";

function CreatePostServer() {
  async function createPostAction(formData: FormData) {
    "use server";

    await api.post.create({
      name: formData.get("name") as string,
    });
    revalidatePath("/");
  }

  return (
    <form action={createPostAction} className="flex flex-col gap-2">
      <input
        type="text"
        name="name"
        placeholder="Title"
        className="w-full rounded-full px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
      >
        Submit
      </button>
    </form>
  );
}

export { CreatePostServer };
