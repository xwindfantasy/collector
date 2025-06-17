<script>
	import Fuse from 'fuse.js';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { debounce } from 'lodash-es';
	import BackTop from '$lib/components/BackTop.svelte';

	// 常量配置
	const SEARCH_CONFIG = {
		DEBOUNCE_DELAY: 300,
		MIN_SEARCH_LENGTH: 1,
		FUSE_OPTIONS: {
			keys: [
				{ name: 'title', weight: 3 },
				{ name: 'tags', weight: 2 },
				{ name: 'description', weight: 1 }
			],
			includeScore: true,
			includeMatches: true,
			useExtendedSearch: true,
			minMatchCharLength: 1
		}
	};

	let { data } = $props();

	// 状态管理
	let fuseIndex = null;
	let fuseInstance = null;
	let searchResults = $state([]);
	let searchInputRef;
	let selectedFolder = $state([]);
	let isAsideVisible = $state(false);
	let searchTerm = $state('');

	// 派生状态
	let formatedData = $derived(formatData(data.data));
	let flattenedData = $derived(flattenData(formatedData));
	let filteredResults = $derived(getFilteredResults());

	// Fuse实例初始化
	$effect(() => {
		try {
			if (flattenedData?.length) {
				fuseIndex = Fuse.createIndex(SEARCH_CONFIG.FUSE_OPTIONS.keys, flattenedData);
				fuseInstance = new Fuse(flattenedData, SEARCH_CONFIG.FUSE_OPTIONS, fuseIndex);
			}
		} catch (error) {
			console.error('Error initializing Fuse:', error);
		}
	});

	// 事件处理函数
	const handleKeyPress = (event) => {
		if (event.key === '/' && event.target.tagName !== 'INPUT') {
			event.preventDefault();
			searchInputRef?.focus();
		}
	};

	// 防抖处理的搜索函数
	const debouncedSearch = debounce(() => {
		try {
			if (!fuseInstance || searchTerm.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
				searchResults = [];
				return;
			}
			selectedFolder = [];
			searchResults = searchTerm ? fuseInstance.search(searchTerm) : flattenedData;
		} catch (error) {
			console.error('Search error:', error);
			searchResults = [];
		}
	}, SEARCH_CONFIG.DEBOUNCE_DELAY);

	// 生命周期处理
	onMount(() => {
		if (browser) {
			document.addEventListener('keydown', handleKeyPress);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('keydown', handleKeyPress);
		}
	});

	// 数据处理函数
	function formatData(data) {
		if (!data) return [];

		try {
			let result = formatDataWithPath(data, '');
			result = sortDataByType(result);
			return result;
		} catch (error) {
			console.error('Error formatting data:', error);
			return [];
		}
	}

	function formatDataWithPath(items, parentPath = '') {
		if (!Array.isArray(items)) return items;

		return items.map((item) => {
			if (item.type === 'folder' && Array.isArray(item.children)) {
				const hasChildFolders = item.children.some((child) => child.type === 'folder');
				return {
					...item,
					path: parentPath,
					hasChildren: hasChildFolders,
					children: formatDataWithPath(item.children, parentPath ? [parentPath, item.title].join('%') : item.title)
				};
			}

			return {
				...item,
				path: parentPath
			};
		});
	}

	function sortDataByType(items) {
		if (!Array.isArray(items)) return items;

		const sortedItems = [...items].sort((a, b) => {
			if (a.type === 'folder' && b.type !== 'folder') return -1;
			if (b.type === 'folder' && a.type !== 'folder') return 1;
			return a.title?.localeCompare(b.title) || 0;
		});

		return sortedItems.map((item) => {
			if (item.type === 'folder' && Array.isArray(item.children)) {
				return {
					...item,
					children: sortDataByType(item.children)
				};
			}
			return item;
		});
	}

	function flattenData(data) {
		if (!Array.isArray(data)) return [];

		try {
			const flattened = [];
			const flatten = (items) => {
				for (const item of items) {
					if (item.type === 'folder' && item.children) {
						flatten(item.children);
					} else if (item) {
						flattened.push(item);
					}
				}
			};
			flatten(data);
			return flattened;
		} catch (error) {
			console.error('Error flattening data:', error);
			return [];
		}
	}

	function highlightText(text, matches) {
		if (!text || !matches?.length) return text;

		try {
			let result = '';
			let lastIndex = 0;

			const sortedMatches = [...matches].sort((a, b) => a[0] - b[0]);

			sortedMatches.forEach(([start, end]) => {
				result += text.slice(lastIndex, start);
				result += `<span class="bg-accent">${text.slice(start, end + 1)}</span>`;
				lastIndex = end + 1;
			});

			result += text.slice(lastIndex);
			return result;
		} catch (error) {
			console.error('Error highlighting text:', error);
			return text;
		}
	}

	function getFilteredResults() {
		if (selectedFolder.length === 0) {
			return searchResults.length > 0 ? searchResults : flattenedData;
		}

		try {
			let folder = formatedData;
			for (let i = 0; i < selectedFolder.length && folder; i++) {
				const element = selectedFolder[i];
				folder = folder.find((item) => item.title === element)?.children || [];
			}
			return folder;
		} catch (error) {
			console.error('Error filtering results:', error);
			return [];
		}
	}

	function handleFolderClick(folderPath) {
		selectedFolder = folderPath ? folderPath.split('%') : [];
		searchResults = [];
		searchTerm = '';
		isAsideVisible = false;
	}

	// 搜索处理
	$effect(() => {
		debouncedSearch();
	});
</script>

<!-- Svelte Head -->
<svelte:head>
	<title>Collector</title>
</svelte:head>

<!-- Navigation Bar -->
<nav class="fixed top-0 z-50 w-full border-b border-base-300 bg-base-100/90 shadow-sm">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<!-- Left Section: Logo and Menu -->
			<div class="flex items-center justify-start rtl:justify-end">
				<button
					type="button"
					class="swap swap-rotate focus:outline-none sm:hidden"
					aria-label="Toggle Menu"
					on:click={() => (isAsideVisible = !isAsideVisible)}
				>
					<input type="checkbox" bind:checked={isAsideVisible} />
					<span class="swap-off icon-[mynaui--menu-solid] fill-current" style="width: 32px; height: 32px;"></span>
					<span class="swap-on icon-[iconamoon--close-light] fill-current" style="width: 32px; height: 32px;"></span>
				</button>
				<a href="#" class="group ms-2 flex md:me-24" aria-label="Home">
					<img src="./favicon.svg" class="me-2 w-20 sm:w-8" alt="Collector Logo" />
					<span class="text-md hidden self-center font-semibold sm:block">Collector</span>
				</a>
			</div>

			<!-- Center Section: Search -->
			<div class="flex items-center justify-end">
				<label class="input input-bordered flex h-10 items-center" for="searchInput">
					<span class="icon-[fluent--search-12-regular]" style="width: 24px; height: 24px;"></span>
					<input
						id="searchInput"
						type="text"
						placeholder="Type / to search"
						class="input input-ghost w-full max-w-xs focus:border-none"
						on:input={debouncedSearch}
						bind:this={searchInputRef}
						bind:value={searchTerm}
						aria-label="Search"
					/>
				</label>
			</div>

			<!-- Right Section: Theme Toggle and Github Link -->
			<div class="flex items-center">
				<div class="ms-3 flex items-center">
					<button type="button" class="swap swap-rotate" data-toggle-theme="dark" data-act-class="swap-active" aria-label="Toggle Theme">
						<span class="swap-off icon-[prime--sun]" style="width: 32px; height: 32px;"></span>
						<span class="swap-on icon-[solar--moon-bold-duotone]" style="width: 32px; height: 32px;"></span>
					</button>
				</div>
				<div>
					<a
						href="https://github.com/wefantasy/collector"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Github Repository"
						class="ms-3 flex items-center"
					>
						<span class="icon-[octicon--mark-github-24]" style="width: 30px; height: 30px;"></span>
					</a>
				</div>
			</div>
		</div>
	</div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isAsideVisible}
	<div class="fixed inset-0 z-30 bg-black/50 transition-opacity sm:hidden" on:click={() => (isAsideVisible = false)} role="dialog" aria-modal="true"></div>
{/if}

<!-- Sidebar -->
<aside
	class="fixed left-0 top-0 z-40 h-screen {isAsideVisible
		? 'translate-x-0'
		: '-translate-x-full'} border-r border-base-300 bg-base-100 pt-20 transition-transform sm:w-48 sm:translate-x-0"
	aria-label="Sidebar"
>
	<nav class="h-full overflow-y-auto px-3 pb-4">
		<ul class="menu space-y-1">
			<li>
				<button
					type="button"
					class="group flex w-full cursor-pointer items-center hover:bg-base-200 {selectedFolder.join('%') === '' ? 'bg-base-200' : ''}"
					on:click={() => handleFolderClick('')}
				>
					<span class="icon-[clarity--folder-open-line]" style="width: 20px; height: 20px;"></span>
					<span>All Items</span>
				</button>
			</li>
			{#each formatedData as item}
				{#if item.type === 'folder'}
					<li>
						<button
							type="button"
							class="group flex w-full cursor-pointer items-center hover:bg-base-200 {selectedFolder.join('%') === item.title ? 'bg-base-200' : ''}"
							on:click={() => handleFolderClick(item.title)}
						>
							<span class="icon-[clarity--folder-open-solid]" style="width: 20px; height: 20px;"></span>
							<span>{item.title}</span>
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	</nav>
</aside>

<!-- Main Content -->
<main class="p-4 sm:ml-48">
	<div class="mt-14 rounded-lg p-4">
		<!-- Breadcrumbs -->
		<nav class="breadcrumbs text-sm text-secondary" aria-label="Breadcrumb">
			<ul>
				<li>
					<button type="button" class="cursor-pointer hover:underline" on:click={() => handleFolderClick('')}> Root </button>
				</li>
				{#each selectedFolder as folder}
					<li>
						<button
							type="button"
							class="cursor-pointer hover:underline"
							on:click={() => handleFolderClick(selectedFolder.slice(0, selectedFolder.indexOf(folder) + 1).join('%'))}
						>
							{folder}
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Content Grid -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each filteredResults as result}
			{#if result.item}
				{@const item = result.item}
				{@const matches = result.matches}
				<div class="card card-side card-compact w-full border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:shadow-md">
					<div class="card-body">
						<img
							src={item.icon || `https://www.google.com/s2/favicons?domain=${item.url}&sz=32`}
							alt="favicon"
							class="h-8 w-8 rounded-full transition-transform duration-500 group-hover:rotate-[360deg]"
						/>
						<h2 class="text-md card-title overflow-hidden truncate whitespace-nowrap">
							{@html highlightText(item.title, matches?.find((m) => m.key === 'title')?.indices)}
						</h2>
						<p class="line-clamp-3 text-base-content/70">
							{@html highlightText(item.description, matches?.find((m) => m.key === 'description')?.indices)}
						</p>
					</div>
				</div>
			{:else}
				<div class="card card-side card-compact w-full border border-base-200 bg-base-100 shadow-sm transition-all duration-300 hover:shadow-md">
					<div class="card-body">
						<img
							src={result.icon || `https://www.google.com/s2/favicons?domain=${result.url}&sz=32`}
							alt="favicon"
							class="h-8 w-8 rounded-full transition-transform duration-500 group-hover:rotate-[360deg]"
						/>
						<h2 class="card-title line-clamp-1">{result.title || 'Untitled'}</h2>
						<p class="line-clamp-3 text-base-content/70">{result.description || 'No description'}</p>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</main>

<!-- Back to Top Button -->
<BackTop />

<div class="mt-4 rounded-lg">
	<div class="text-center">
		© 2025 <a href="https://github.com/wefantasy/collector" target="_blank" aria-label="github" class="link-hover link link-primary">collector</a>, Design by
		<a href="https://github.com/wefantasy" target="_blank" aria-label="github" class="link-hover link link-primary">wefantasy</a>
	</div>
</div>
