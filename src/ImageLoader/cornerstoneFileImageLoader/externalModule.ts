import { loadImage } from './loadImage';

let cornerstone;

const external = {
    set cornerstone(cs) {
        cornerstone = cs;
        cornerstone.registerImageLoader('imagefile', loadImage);
    },
    get cornerstone() {
        return cornerstone;
    },
};

export { external };
