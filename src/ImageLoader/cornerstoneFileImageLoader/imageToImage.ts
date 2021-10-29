export default (image): Promise<any> => {
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-param-reassign
        image.onload = () => {
            resolve(image);
        };

        // eslint-disable-next-line no-param-reassign
        image.onerror = (error) => {
            reject(error);
        };
    });
};
