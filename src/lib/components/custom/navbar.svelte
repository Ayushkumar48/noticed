<script lang="ts">
    import { navHeight } from "$lib/stores/store.svelte";
    import { Motion } from "svelte-motion";
    import BorderBeam from "../animated/border-beam.svelte";
    import { page } from "$app/state";
    import NavUser from "./nav-user.svelte";
    let left = $state(0);
    let width = $state(0);
    let opacity = $state(0);
    let navs = $state([
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Your Notes",
            link: "/notes",
        },
    ]);
    $effect(() => {
        if (!page.data?.user) {
            navs = [
                {
                    name: "Home",
                    link: "/",
                },
                {
                    name: "Your Notes",
                    link: "/notes",
                },
                {
                    name: "Login/Signup",
                    link: "/login",
                },
            ];
        }
    });
    const positionMotion = (node: HTMLElement) => {
        const refNode = () => {
            const mint = node.getBoundingClientRect();
            left = node.offsetLeft;
            width = mint.width;
            opacity = 1;
        };
        node.addEventListener("mouseenter", refNode);
        return {
            destroy() {
                node.removeEventListener("mouseenter", refNode);
            },
        };
    };
</script>

<div
    class="py-2 w-full flex justify-between items-center px-40 z-50 fixed"
    bind:offsetHeight={navHeight.current}
>
    <a href="/" data-sveltekit-preload-code class="z-50">
        <h1
            class="text-3xl font-semibold bg-gradient-to-b from-white to-neutral-700 text-transparent bg-clip-text"
        >
            Noticed
        </h1>
    </a>
    <ul
        onmouseleave={() => {
            opacity = 0;
        }}
        class="relative mx-auto flex w-fit rounded-full p-1 border border-white/10 bg-black transition-colors"
    >
        <BorderBeam size={50} duration={12} />
        {#each navs as item}
            <li
                use:positionMotion
                class="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-1.5 md:text-base"
            >
                <a href={item.link}>{item.name}</a>
            </li>
        {/each}
        <Motion
            animate={{
                left: left,
                width: width,
                opacity: opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
            }}
            let:motion
        >
            <li
                use:motion
                class="absolute z-0 h-7 rounded-full bg-gray-300 md:h-9"
            ></li>
        </Motion>
    </ul>
    {#if page.data?.user}
        <NavUser user={page.data.user} />
    {/if}
</div>
