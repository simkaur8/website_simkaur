import { defineType, defineField } from 'sanity'

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'YouTube', value: 'youtube' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'id',
      title: 'Video ID',
      type: 'string',
      description:
        'The video ID from the URL (e.g., 1092672509 for Vimeo, dGxXAoKr_X4 for YouTube)',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
