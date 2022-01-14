import arrayBufferToImage from './arrayBufferToImage';
import createImage from './createImage';
import fileManager from './fileManager';
import parseImageId from './parseImageId';

let options = {};

// Loads an image from a HTML5 API file to an image
export function loadImage(imageId) {
    const parsedImageId = parseImageId(imageId);
    const fileIndex = parseInt(parsedImageId.url, 10);
    const file = fileManager.get(fileIndex);

    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            if (e.target === null) {
                return;
            }

            const imageAsArrayBuffer = e.target.result;
            const imagePromise = arrayBufferToImage(imageAsArrayBuffer);
            imagePromise.then((image) => {
                const imageObject = createImage(image, imageId);
                resolve(imageObject);
            }, reject);
        };

        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
    });

    return {
        promise,
        cancelFn: undefined,
    };
}

export function configure(opts) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options = opts;
}
