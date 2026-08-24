export type ExportFormat =
    | 'square'
    | 'portrait'
    | 'story'


export interface ExportDimensions {
    width: number
    height: number
}


export const exportFormats:
    Record<ExportFormat, ExportDimensions> = {

    square: {
        width: 1080,
        height: 1080,
    },

    portrait: {
        width: 1080,
        height: 1350,
    },

    story: {
        width: 1080,
        height: 1920,
    },

}
