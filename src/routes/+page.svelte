<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';
    // Import Mozilla's Readability library:
    import {Readability} from '@mozilla/readability';
    import {convertHtmlToMarkdown} from 'dom-to-semantic-markdown';

        let urlToFetch = '';
    let isLoading = false;
    let articleHtml = ''; // We will store the readable HTML here

    // Keep your existing markdown editor logic:
    let markdownText = `# Dark Mode Markdown Editor
  
Type some Markdown on the left...
    
- This is a list item
- Another list item
  
**Bold** and _italic_ work, too.
`;

    // When the component mounts:
    onMount(() => {
        // Setup your textarea auto-resize
        document.querySelectorAll("textarea").forEach(function (textarea) {
            textarea.style.height = textarea.scrollHeight + "px";
            textarea.style.overflowY = "hidden";

            textarea.addEventListener("input", function () {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            });
        });

        // Setup Marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
        });
    });

    // Function to fetch the URL, parse it with Readability, and update articleHtml
    async function fetchReadableContent(event: Event) {
        event.preventDefault();
        if (!urlToFetch) return;

        isLoading = true;
        markdownText = ''; // Clear previous content

        try {
            const response = await fetch(urlToFetch);
            const html = await response.text();

            // Parse the fetched HTML string
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const reader = new Readability(doc);
            const article = reader.parse();

            if (article?.content) {
                // article.content is the “readable” HTML
                markdownText = convertHtmlToMarkdown(article.content);
      
                
            } else {
                markdownText = '<p class="text-red-400">Unable to parse article content.</p>';
            }
        } catch (error) {
            console.error(error);
            markdownText = '<p class="text-red-400">Error fetching or parsing content.</p>';
        } finally {
            isLoading = false;
        }
    }
</script>

<!-- A simple form for the URL input -->
<form class="p-2 mb-4 flex gap-2 items-center" on:submit|preventDefault={fetchReadableContent}>
    <label for="urlField" class="text-white whitespace-nowrap">Enter URL:</label>
    <input
        id="urlField"
        type="text"
        class="flex-grow p-2 rounded border border-neutral-500 bg-neutral-800 text-white"
        placeholder="https://example.com/article"
        bind:value={urlToFetch}
    />
    <button
        class="btn px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        disabled={isLoading}
    >
        {#if isLoading}
            Loading...
        {/if}
        {#if !isLoading}
            Fetch
        {/if}
    </button>
</form>


<!-- Existing Markdown Editor Layout -->
<div class="flex flex-row flex-grow gap-2 p-2 bg-neutral-950">
    <div class="w-1/2">
        <p class="text-white">Raw</p>
        <div class="border bg-neutral-900 relative">
            <textarea
                class="textarea w-full p-4 resize-none min-h-[90vh] bg-transparent text-white 
                    rounded focus:outline-none focus:border-none"
                bind:value={markdownText}
            />
            <button
                class="btn absolute text-white bg-transparent border-neutral-500 
                    hover:bg-transparent hover:border-neutral-300 right-4 top-4"
            >
                Copy
                <svg
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill-rule="evenodd"
                        d="M18 3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1V9a4 4 0 0 0-4-4h-3a1.99 1.99 0 0 0-1 .267V5a2 2 0 0 1 2-2h7Z"
                        clip-rule="evenodd"
                    />
                    <path
                        fill-rule="evenodd"
                        d="M8 7.054V11H4.2a2 2 0 0 1 .281-.432l2.46-2.87A2 2 0 0 1 8 7.054ZM10 7v4a2 2 0 0 1-2 2H4v6a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        </div>
    </div>
    <div class="w-1/2">
        <p class="text-white">Markdown</p>
        <div class="border bg-neutral-900">
            <div class="markdown-content min-h-[90.2vh] p-4 overflow-x-scroll text-white relative">
                {@html marked(markdownText)}
            </div>
        </div>
    </div>
</div>
