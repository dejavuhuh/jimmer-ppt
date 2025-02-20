import type {
  Preset,
} from 'unocss'
import { fonts, rules, shortcuts, theme, typography } from '@alvarosabu/ui'
import {
  defineConfig,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme,
  shortcuts,
  rules,
  presets: [
    presetWebFonts({
      provider: 'none',
      fonts: {
        mono: ['Menlo'],
      },
    }),
    presetTypography(typography) as unknown as Preset,
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
