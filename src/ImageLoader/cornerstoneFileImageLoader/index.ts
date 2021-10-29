import arrayBufferToImage from './arrayBufferToImage';
import createImage from './createImage';
import { external } from './externalModule';
import fileManager from './fileManager';
import { configure } from './loadImage';

const cornerstoneFileImageLoader = {
    arrayBufferToImage,
    createImage,
    configure,
    external,
    fileManager,
};

export default cornerstoneFileImageLoader;
