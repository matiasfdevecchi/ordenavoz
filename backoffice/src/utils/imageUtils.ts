export const urlToFiles = async (urls: string[]): Promise<File[]> => {
    const filePromises = urls.map(async (url) => {
        try {
            const response = await fetch(url, {
                mode: 'cors',
            });
            const blob = await response.blob();

            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1] || 'archivo';

            return new File([blob], filename, { type: blob.type });
        } catch (error) {
            return undefined;
        }
    });

    return Promise.all(filePromises).then((files) => files.filter((file) => file !== undefined)) as Promise<File[]>;
};

export const urlToFile = async (url: string): Promise<File | undefined> => {
    try {
        const response = await fetch(url, {
            mode: 'cors',
        });
        const blob = await response.blob();

        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1] || 'archivo';

        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        return undefined;
    }
};