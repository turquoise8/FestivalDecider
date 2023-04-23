let timer: NodeJS.Timer;

export const debouncedSearch = (val: string, searchFunction: (val: string) => Promise<void>) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		searchFunction(val);
	}, 500);
};
