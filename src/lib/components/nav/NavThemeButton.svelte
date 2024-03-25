<script>
    import { onDestroy, onMount } from "svelte";
    import NavButton from "./NavButton.svelte";
    import { MoonOutline, SunOutline } from "flowbite-svelte-icons";
    import { darkMode } from "../../../stores/darkMode";

    let isDark = false;

    const unsubscribe = darkMode.subscribe(value => {
        isDark = value;
        if (value) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

    function toggleTheme() {
        darkMode.update(value => !value);
    }

</script>

<NavButton
    icon={isDark ? SunOutline : MoonOutline}
    onClick={toggleTheme}
/>
