<script lang="ts">
    import { page } from "$app/state";
    import LoginForm from "$lib/components/login-form.svelte";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    onMount(() => {
        const message = page.url.searchParams.get("message");
        const messageType = page.url.searchParams.get("type");
        if (message) {
            if (messageType === "info") {
                toast.info(message);
            } else {
                toast.error(message);
            }
        }
    });
</script>

<div
    class="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
>
    <div class="w-full max-w-sm">
        <LoginForm />
    </div>
</div>
