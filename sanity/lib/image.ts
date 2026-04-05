import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client'
import type { SanityImageSource } from '@sanity/image-url'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource | null | undefined) {
  if (source == null) {
    return { url: () => '' } as ReturnType<typeof builder.image>
  }
  return builder.image(source)
}
