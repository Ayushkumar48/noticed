<script lang="ts">
    import { enhance } from "$app/forms";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { type User } from "$lib/server/db/schema";
    import { extractInitials } from "$lib/utils";
    let { user }: { user: User } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <Avatar.Root class="ring-1 ring-gray-300 shadow-lg">
            <Avatar.Image src={user.picture} alt={user.name} />
            <Avatar.Fallback>{extractInitials(user.name)}</Avatar.Fallback>
        </Avatar.Root>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>My Account</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>
                <form action="/login?/logout" method="POST" use:enhance>
                    <button class="focus-within:outline-none" type="submit">
                        Logout
                    </button>
                </form>
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
