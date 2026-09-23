// Which ContentTools entry a page is ("projects/bosch"), or null.
//
// Only markdown pages in these folders are entries. The page itself declares
// it (layouts/main.pug), rather than the editor matching URLs against its
// config, because til/ and reference/ also hold Pug pages at the same URL
// shape, and the editor can only edit markdown. Keep this list in step with
// the collections in static/cms-config.yml; test/content/cms.test.js compares
// them.
//
// The default export must stay this module's only export: Eleventy unwraps
// `default` only when it is alone, and a named export beside it would bury
// `cmsEntry` one level down, where no template looks.
//
// The slug is the file name exactly as it is on disk. Eleventy keeps it
// verbatim in the URL here (date prefix, dots and case included), so it can't
// be `page.fileSlug`, which drops a TIL's YYYY-MM-DD- prefix.
const CMS_FOLDERS = ["projects", "reference", "til"];

const ENTRY = new RegExp(`^\\./content/(${CMS_FOLDERS.join("|")})/([^/]+)\\.md$`);

export default {
    cmsEntry: (data) => {
        const found = ENTRY.exec(data.page?.inputPath ?? "");
        return found ? `${found[1]}/${found[2]}` : null;
    },
};
