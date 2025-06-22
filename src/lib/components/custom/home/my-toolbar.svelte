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
</script>

<Toolbar>
  {#snippet children({ editor, activeEditor, blockType })}
    <SaveButton />
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
