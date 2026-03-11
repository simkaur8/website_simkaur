import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroShowreel',
      title: 'Hero Showreel',
      type: 'videoEmbed',
    }),
    defineField({
      name: 'logoVideoWebm',
      title: 'Logo Video (WebM)',
      type: 'file',
    }),
    defineField({
      name: 'logoVideoMov',
      title: 'Logo Video (MOV)',
      type: 'file',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'footerCta',
      title: 'Footer CTA',
      type: 'string',
      initialValue: 'contact me :-)',
    }),
  ],
})
