const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

export const getProjectMediaSrc = (media) => (
    typeof media === 'string' ? media : media?.src || ''
);

export const getProjectMediaKey = (media, index) => (
    getProjectMediaSrc(media) || `project-media-${index}`
);

export const isProjectVideoMedia = (media) => {
    const src = getProjectMediaSrc(media);
    return media?.type === 'video' || VIDEO_EXTENSION.test(src);
};
