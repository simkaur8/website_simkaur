import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { projectId, dataset } from '@/sanity/env'
import { schemaTypes } from '@/sanity/schemas'

export default defineConfig({
  name: 'simkaur-studio',
  title: 'Sim Kaur Studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
