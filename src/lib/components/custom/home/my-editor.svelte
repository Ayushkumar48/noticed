<script lang="ts">
  import {
    Composer,
    ContentEditable,
    HorizontalRuleNode,
    HorizontalRulePlugin,
    RichTextPlugin,
  } from "svelte-lexical";
  import { theme } from "svelte-lexical/dist/themes/default";
  import MyToolbar from "./my-toolbar.svelte";
  import SaveButton from "./save-button.svelte";

  const initialConfig = {
    theme: theme,
    namespace: "pg_demo",
    nodes: [HorizontalRuleNode],
    onError: (error: Error) => {
      throw error;
    },
  };
</script>

<Composer {initialConfig}>
  <div class="editor-shell svelte-lexical">
    <MyToolbar />

    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
        </div>
      </div>
      <RichTextPlugin />
      <HorizontalRulePlugin />
    </div>
  </div>
</Composer>
