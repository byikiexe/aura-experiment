import type { Aura } from '../types/aura'

import {
    exportFormats,
    type ExportFormat,
} from './formats'

import {
    AuraExportRenderer,
} from './exportRenderer'


const renderer =
    new AuraExportRenderer()


export async function exportAura(
    aura: Aura,
    format: ExportFormat
): Promise<void> {

    await document.fonts.ready

    const dimensions =
        exportFormats[format]


    const canvas =
        document.createElement(
            'canvas'
        )

    canvas.width =
        dimensions.width

    canvas.height =
        dimensions.height


    renderer.render(
        canvas,
        aura
    )


    const blob =
        await new Promise<Blob | null>(
            (resolve) => {

                canvas.toBlob(
                    resolve,
                    'image/png',
                    1
                )
            }
        )


    if (!blob) {

        throw new Error(
            'Unable to export AURA'
        )
    }


    const url =
        URL.createObjectURL(blob)


    const link =
        document.createElement('a')

    link.href = url

    link.download =
        `aura-${aura.seedHex.toLowerCase()}-${format}.png`


    document.body.appendChild(link)

    link.click()

    link.remove()


    URL.revokeObjectURL(url)
}
