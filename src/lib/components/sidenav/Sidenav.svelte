<script>
    import {
        ArrowLeftToBracketOutline,
        CogOutline,
        SearchOutline
    } from "flowbite-svelte-icons";
    import NavBrandButton from "../nav/NavBrandButton.svelte";
    import NavButton from "../nav/NavButton.svelte";
    import NavLink from "../nav/NavLink.svelte";
    import SidenavSplitter from "./SidenavSplitter.svelte";
    import { clearUserAndToken } from "../../../stores/auth";

    function handleSignOut() {
        console.log("Sign out");
        clearUserAndToken();
    }
</script>

<div
    class="absolute left-0 top-0 flex flex-col w-14 h-full border-r border-r-zinc-200 dark:border-r-zinc-700 px-2 dark:bg-dark bg-light py-2"
>
    <NavBrandButton />
    <SidenavSplitter />
    <NavLink title="Search" icon={SearchOutline} url="/search" />
    <div class="flex grow"></div>
    <NavLink title="Settings" icon={CogOutline} url="/settings" />
    <NavButton title="Sign Out" icon={ArrowLeftToBracketOutline} onClick={handleSignOut} />
</div>
