import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const homepage = await readFile(
  new URL('../src/pages/index.astro', import.meta.url),
  'utf8',
)

test("Visitor understands the site's owner and role", () => {
  assert.match(homepage, /<h1[^>]*>\s*Felix Hungenberg\s*<\/h1>/)
  assert.match(homepage, /Software developer and engineering designer/)
})

test('Homepage has a clear document structure', () => {
  assert.equal((homepage.match(/<main\b/g) ?? []).length, 1)
  assert.match(homepage, /<h1\b/)
})

test('Homepage replaces the WIP gallery link', () => {
  assert.doesNotMatch(homepage, /Gallery Demo/)
})
