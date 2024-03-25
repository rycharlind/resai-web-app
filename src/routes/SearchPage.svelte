<script>
    import {
        Alert,
        Button,
        CloseButton,
        Heading,
        Input,
        Spinner,
    } from "flowbite-svelte";
    import {
        InfoCircleSolid,
        UploadOutline,
        SearchOutline,
    } from "flowbite-svelte-icons";
    import { loadToken, tokenStore } from "../stores/auth";

    import SearchDrawer from "../lib/components/search/SearchDrawer.svelte";
    import SearchResultsGrid from "../lib/components/search/SearchResultsGrid.svelte";

    const apiUrl = process.env.API_URL;

    let searchResults = null;
    let searchText = "";
    let isLoading = false;
    let hasError = true;
    let errorMessage = "Try refreshing the page.";
    let accessToken;

    $: {
        loadToken();
        accessToken = $tokenStore;
        if (accessToken) {
            search(searchText, "", accessToken);
        }
    }

    const search = async (searchText, filePath, accessToken) => {
        if (isLoading) {
            return;
        }

        if (!accessToken) {
            console.log("No Access Token");
            return;
        }

        try {
            isLoading = true;
            const response = await fetch(`${apiUrl}/search`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search_text: searchText,
                    file_path: filePath,
                    top: 12,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const respBody = await response.json();
            searchResults = respBody?.data?.value;
            isLoading = false;
            hasError = false;
        } catch (error) {
            console.error(
                "There was a problem with the fetch operation: " +
                    error.message,
            );
            isLoading = false;
            hasError = true;
            errorMessage = "Unauthorized. Please login.";
        }
    };

    const submitSearch = async (event) => {
        event.preventDefault();
        search(searchText, "");
    };

    const clearSearch = async (event) => {
        event.preventDefault();
        searchText = "";
        search(searchText, "", accessToken);
    };

    function debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }

    function handleInput(event) {
        searchText = event.target.value;
    }

    const debouncedInput = debounce(handleInput, 500);

    let fileInput;
    let file;

    function triggerFileSelect() {
        fileInput.click();
    }

    // todo: handle file upload
    function handleFileSelect(event) {
        file = event.target.files[0];
        console.log(file);
        // Handle the selected file
    }
</script>

<div class="w-full h-full">
    <Heading level="1" class="mb-4">Search</Heading>

    <form on:submit={submitSearch}>
        <div>
            <Input
                on:input={debouncedInput}
                type="text"
                id="searchText"
                name="searchText"
                placeholder="Search Text"
            >
                <CloseButton slot="right" on:click={clearSearch} />
            </Input>
            <input
                type="file"
                bind:this={fileInput}
                on:change={handleFileSelect}
                style="display: none"
            />
            <div class="my-4"></div>
            <Button type="submit" size="xl" disabled={isLoading}>
                {#if isLoading}
                    <Spinner class="me-3" size="4" color="white" />
                {/if}
                <SearchOutline class="w-3.5 h-3.5 me-2" />
                <span>Search</span>
            </Button>
            <Button on:click="{triggerFileSelect}" color="blue" size="xl" disabled={isLoading}>
                <UploadOutline class="w-3.5 h-3.5 me-2" />
                <span>Attach Document</span>
            </Button>
            {#if file}
                <span class="ml-3">{file.name}</span>
            {/if}
        </div>
    </form>

    <div class="mt-6">
        {#if isLoading}
            <div>Loading ...</div>
        {:else if hasError}
            <Alert border color="red">
                <InfoCircleSolid slot="icon" class="w-4 h-4" />
                <span class="font-medium">Whoops, there was an error.</span>
                {errorMessage}
            </Alert>
        {:else}
            <SearchResultsGrid {searchResults} {isLoading} columns={4} />
            <SearchDrawer />
        {/if}
    </div>
</div>
