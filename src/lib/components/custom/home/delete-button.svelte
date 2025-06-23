<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { page } from "$app/state";
  import { notes } from "$lib/client";
  import { Trash2 } from "@lucide/svelte";
  import { toast } from "svelte-sonner";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import { goto } from "$app/navigation";
  let openDialog = $state(false);
</script>

<form
  action="/notes/?/delete"
  method="POST"
  id="delete-note-form"
  use:enhance={() => {
    return async ({ result, update }) => {
      if (result.type === "success") {
        try {
          await notes.delete(page.params?.noteId);
        } catch (err) {
          console.error(err);
        }
        toast.success("Note Deleted!");
        goto("/");
        openDialog = false;
      } else {
        toast.error("Error while deleting note.");
      }
      await applyAction(result);
    };
  }}
>
  <input type="text" value={page.params?.noteId} name="noteId" class="hidden" />
  <Dialog.Root bind:open={openDialog}>
    <Dialog.Trigger
      class="cursor-pointer shrink-0 h-full w-full border-r border-gray-200"
      type="button"
    >
      <Trash2
        strokeWidth={1.5}
        class="hover:bg-neutral-300 h-6 w-6 rounded-md p-0.5 mx-1"
      />
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Delete Note</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this note?
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button
          type="submit"
          variant="destructive"
          form="delete-note-form"
          class="cursor-pointer"
        >
          Delete
        </Button>
        <Dialog.Close
          class={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}
        >
          Cancel
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</form>
