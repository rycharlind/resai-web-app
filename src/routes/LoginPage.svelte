<script>
    import { Button, Heading } from "flowbite-svelte";
    import Logo2 from "../lib/components/brand/Logo2.svelte";
    import { PublicClientApplication } from "@azure/msal-browser";
    import { darkMode } from "../stores/darkMode";
    import { msalConfig } from "../stores/auth";
    import { saveUser, saveToken } from "../stores/auth";

    import { onMount } from "svelte";

    const azureClientId = process.env.AZURE_CLIENT_ID;

    let msalInstance;

    onMount(async () => {
        msalInstance =
            await PublicClientApplication.createPublicClientApplication(
                msalConfig,
            );
    });

    function changeDarkMode() {
        darkMode.update((value) => !value);
    }

    async function signIn() {
        msalInstance
            .loginPopup({
                scopes: ["openid", "profile", "User.Read"],
            })
            .then((tokenResponse) => {
                getAccessToken();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function getAccessToken() {
        const account = msalInstance.getAllAccounts()[0];
        saveUser(account);

        msalInstance
            .acquireTokenSilent({
                account: account,
                scopes: [
                    `api://${azureClientId}/Api.Read`,
                    `api://${azureClientId}/Api.ReadWrite`,
                ],
            })
            .then((response) => {
                saveToken(response.accessToken);
            })
            .catch((error) => {
                console.log(error);
            });
    }
</script>

<div class="flex w-full h-full dark:bg-dark">
    <div class="flex-1 h-full">
        <div class="flex w-full h-full justify-center items-center">
            <div class="w-1/2">
                <Heading
                    tag="h1"
                    class="mb-4"
                    customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
                    >Fennec AI Find</Heading
                >
                <Button on:click={signIn} class="mb-4 bg-[#fe5a5e]" size="xl">
                    Login with Microsoft</Button
                >
            </div>
        </div>
    </div>
    <div class="flex-1 h-full">
        <div
            class="w-full h-full bg-dark dark:bg-light flex justify-center items-center"
        >
            <button on:click={changeDarkMode} class="w-1/2 h-1/2">
                <Logo2 />
            </button>
        </div>
    </div>
</div>
