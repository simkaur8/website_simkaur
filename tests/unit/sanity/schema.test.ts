import { describe, it, expect } from 'vitest'
import { schemaTypes } from '@/sanity/schemas'

interface SchemaField {
  name: string
  type: string
}

interface SchemaWithFields {
  name: string
  fields: SchemaField[]
}

function findSchema(name: string): SchemaWithFields {
  const schema = schemaTypes.find((s) => s.name === name)
  if (!schema || !('fields' in schema)) {
    throw new Error(`Schema "${name}" not found or has no fields`)
  }
  return schema as SchemaWithFields
}

function getFieldNames(schema: SchemaWithFields): string[] {
  return schema.fields.map((f) => f.name)
}

describe('Sanity schemas', () => {
  it('exports all required schema types', () => {
    const typeNames = schemaTypes.map((s) => s.name)
    expect(typeNames).toContain('project')
    expect(typeNames).toContain('photoCollection')
    expect(typeNames).toContain('exhibition')
    expect(typeNames).toContain('siteSettings')
    expect(typeNames).toContain('linkInBio')
    expect(typeNames).toContain('videoEmbed')
    expect(typeNames).toContain('credit')
  })

  it('project schema has all required fields', () => {
    const fieldNames = getFieldNames(findSchema('project'))
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('category')
    expect(fieldNames).toContain('year')
    expect(fieldNames).toContain('thumbnail')
    expect(fieldNames).toContain('videoEmbed')
    expect(fieldNames).toContain('description')
    expect(fieldNames).toContain('credits')
    expect(fieldNames).toContain('gallery')
    expect(fieldNames).toContain('sortOrder')
  })

  it('photoCollection schema has all required fields', () => {
    const fieldNames = getFieldNames(findSchema('photoCollection'))
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('category')
    expect(fieldNames).toContain('coverImage')
    expect(fieldNames).toContain('photos')
    expect(fieldNames).toContain('sortOrder')
  })

  it('exhibition schema has all required fields', () => {
    const fieldNames = getFieldNames(findSchema('exhibition'))
    expect(fieldNames).toContain('title')
    expect(fieldNames).toContain('slug')
    expect(fieldNames).toContain('subtitle')
    expect(fieldNames).toContain('year')
    expect(fieldNames).toContain('description')
    expect(fieldNames).toContain('media')
    expect(fieldNames).toContain('externalLink')
  })

  it('siteSettings schema has all required fields', () => {
    const fieldNames = getFieldNames(findSchema('siteSettings'))
    expect(fieldNames).toContain('bio')
    expect(fieldNames).toContain('email')
    expect(fieldNames).toContain('socialLinks')
    expect(fieldNames).toContain('footerCta')
  })

  it('project thumbnail is image type', () => {
    const project = findSchema('project')
    const thumbnail = project.fields.find((f) => f.name === 'thumbnail')
    expect(thumbnail?.type).toBe('image')
  })
})
