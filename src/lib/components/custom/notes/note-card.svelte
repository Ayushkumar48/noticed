<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Pencil, Trash2, type Icon as IconType } from "@lucide/svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { type Component } from "svelte";
  import { cn } from "$lib/utils";
  import { toast } from "svelte-sonner";
  import { notes } from "$lib/client";
  type Note = {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
  };
  let { note }: { note: Note } = $props();
  let openDialog = $state(false);
</script>

<Card.Root class="w-full max-w-6xl">
  <Card.Header class="flex justify-between items-center">
    <Card.Title>
      Created on {note.createdAt.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </Card.Title>
    <form
      class="flex items-center gap-x-1.5"
      id="delete-note-form"
      method="POST"
      use:enhance={() => {
        return async ({ result, update }) => {
          if (result.type === "success") {
            await notes.delete(note.id);
            toast.success("Note Deleted!");
            openDialog = false;
          } else {
            toast.error("Error while deleting note.");
          }
          await update();
          await applyAction(result);
        };
      }}
    >
      <input type="text" value={note.id} name="noteId" class="hidden" />
      {@render utilButton({
        Icon: Trash2,
        type: "submit",
        formaction: "/notes?/delete",
        modal: true,
      })}
      {@render utilButton({
        Icon: Pencil,
        onclick: () => goto(`/notes/${note.id}`),
      })}
    </form>
  </Card.Header>
  <Card.Content>
    {@html note.content}
  </Card.Content>
</Card.Root>

{#snippet utilButton({
  Icon,
  type = "button",
  onclick,
  formaction,
  modal = false,
}: {
  Icon: Component;
  type?: "button" | "submit" | "reset";
  onclick?: () => any;
  formaction?: string;
  modal?: boolean;
})}
  {#if modal}
    <Dialog.Root bind:open={openDialog}>
      <Dialog.Trigger
        class={cn(
          buttonVariants({ variant: "outline" }),
          "w-8 h-8 rounded-full cursor-pointer",
        )}
        type="button"
      >
        <Icon class="p-[0.8px]" />
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
            {type}
            {formaction}
            variant="destructive"
            class="cursor-pointer"
            form="delete-note-form"
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
  {:else}
    <Button
      variant="outline"
      class="w-8 h-8 rounded-full cursor-pointer"
      {type}
      {onclick}
      {formaction}
    >
      <Icon class="p-[0.8px]" />
    </Button>
  {/if}
{/snippet}
