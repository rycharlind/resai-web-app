<script>
    import { onMount } from "svelte";
    import { Route, Router } from "svelte-routing";
    import Header from "../lib/components/header/Header.svelte";
    import Sidenav from "../lib/components/sidenav/Sidenav.svelte";
    import AboutPage from "../routes/AboutPage.svelte";
    import HomePage from "../routes/HomePage.svelte";
    import LoginPage from "../routes/LoginPage.svelte";
    import NotFoundPage from "../routes/NotFoundPage.svelte";
    import SearchPage from "../routes/SearchPage.svelte";
    import { loadUser, userStore } from "../stores/auth";
    import { darkMode } from "../stores/darkMode";

    let isAuth = false;

    let darkClass = "";

    darkMode.subscribe((value) => {
        darkClass = value ? "dark" : "";
    });

    onMount(() => {
        loadUser();

        const unsubscribe = userStore.subscribe((user) => {
            if (user) {
                isAuth = true;
            } else {
                isAuth = false;
            }
        });

        return unsubscribe;
    });

    darkMode.subscribe((value) => {
        darkClass = value ? "dark" : "";
    });
</script>

<div class="fixed left-0 right-0 bottom-0 top-0 {darkClass}">
    {#if isAuth}
        <Sidenav />
        <div class="absolute top-0 right-0 bottom-0 left-14">
            <Header />
            <div
                class="absolute left-0 top-14 bottom-0 right-0 overflow-scroll p-8 bg-light dark:bg-dark"
            >
                <Router>
                    <Route path="/" component={HomePage} />
                    <Route path="/about" component={AboutPage} />
                    <Route path="/search" component={SearchPage} />
                    <Route path="*" component={NotFoundPage} />
                </Router>
            </div>
        </div>
    {:else}
        <LoginPage />
    {/if}
</div>
