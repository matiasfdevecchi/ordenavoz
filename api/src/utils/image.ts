export const getImageFolder = (urlString: string): string => {
    try {
        const url = new URL(urlString);
        return url.pathname.split('/').slice(0, -1).join('/').replace(/^\//, '');
    } catch (error) {
        return "";
    }
}