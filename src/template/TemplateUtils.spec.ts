import { executeTemplate, executeTemplateIfTargetNotEditedByUser } from './TemplateUtils';

const EXISTING_PATH = '/existing/path';
const EXISTING_TEMPLATE = 'a-template';
const EXISTING_TEMPLATE_HASH = '373ad744be65eea26b0eb58ef7d8df8e'

jest.mock('handlebars');
jest.mock('fs');
jest.mock('fs/promises');

test('writes template and retrieves hash', async () => {
    const hash = await executeTemplate(EXISTING_PATH, EXISTING_TEMPLATE, {});
    expect(hash).toBe(EXISTING_TEMPLATE_HASH);
});

test('attempt to write an unknown template', () => {
    return expect(executeTemplate(EXISTING_PATH, 'another-template', {})).rejects.toBe(
        'Template not found: another-template',
    );
});

test('writing a new file ignores hash', async () => {
    const hash = await executeTemplateIfTargetNotEditedByUser('/a/new/path', EXISTING_TEMPLATE, {}, 'irrelevant_hash')
    expect(hash).toBe(EXISTING_TEMPLATE_HASH)
});

test('overwriting an existing file with non-modified hash', async () => {
    const hash = await executeTemplateIfTargetNotEditedByUser(EXISTING_PATH, EXISTING_TEMPLATE, {}, EXISTING_TEMPLATE_HASH)
    expect(hash).toBe(EXISTING_TEMPLATE_HASH)
});

test('skipping file with modified hash', async() => {
    const hash = await executeTemplateIfTargetNotEditedByUser('/existing/path/modified', EXISTING_TEMPLATE, {}, EXISTING_TEMPLATE_HASH)
    expect(hash).toBeNull();
});

test('skipping file when no checksum provided', async() => {
    const hash = await executeTemplateIfTargetNotEditedByUser(EXISTING_PATH, EXISTING_TEMPLATE, {}, null)
    expect(hash).toBeNull();
});