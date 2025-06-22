<script lang="ts">
  import {
    Composer,
    ContentEditable,
    generateNodesFromDOM,
    HorizontalRuleNode,
    HorizontalRulePlugin,
    RichTextPlugin,
    $getRoot as getRoot,
  } from "svelte-lexical";
  import { theme } from "svelte-lexical/dist/themes/default";
  import MyToolbar from "./my-toolbar.svelte";
  import { onMount } from "svelte";

  const initialConfig = {
    theme: theme,
    namespace: "pg_demo",
    nodes: [HorizontalRuleNode],
    onError: (error: Error) => {
      throw error;
    },
  };
  let { content = $bindable("") }: { content?: string } = $props();
  let composer: Composer | undefined = $state();
  onMount(() => {
    if (composer) {
      const editor = composer.getEditor();
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");
        const nodes = generateNodesFromDOM(editor, dom);
        const selection = getRoot().select();
        selection.insertNodes(nodes);
      });
    }
  });
</script>

<div class="px-4 xl:px-0">
  <Composer {initialConfig} bind:this={composer}>
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
</div>
