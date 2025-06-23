<script lang="ts">
  import {
    BoldButton,
    Divider,
    ItalicButton,
    UnderlineButton,
    StrikethroughButton,
    FormatCodeButton,
    DropDownAlign,
    FontFamilyDropDown,
    FontSizeDropDown,
    Toolbar,
    InsertDropDown,
    InsertHRDropDownItem,
  } from "svelte-lexical";
  import SaveButton from "./save-button.svelte";
  import DeleteButton from "./delete-button.svelte";
  import { page } from "$app/state";
</script>

<Toolbar>
  {#snippet children()}
    <SaveButton />
    {#if page.params.noteId}
      <DeleteButton />
    {/if}
    <FontFamilyDropDown />
    <FontSizeDropDown />
    <Divider />
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <StrikethroughButton />
    <FormatCodeButton />
    <Divider />
    <InsertDropDown>
      <InsertHRDropDownItem />
    </InsertDropDown>
    <DropDownAlign />
  {/snippet}
</Toolbar>
