// @ts-ignore
import fsPromise from 'fs/promises';
import axios from 'axios';
import fg from "fast-glob";

interface FileItem {
  filename: string
  filepath: string
}

async function getUiComponentFiles(base_url: string, unique_id: string, list_component: FileItem[], semantic_versioning?: string) {
  const baseURL = base_url;
  await fsPromise.mkdir("./src/components", { recursive: true });
  
  const files = await fg("./src/components/*.tsx");
  await Promise.all(files.map(file => fsPromise.rm(file, { force: true })));
  
  await Promise.all(list_component.map(async ({ filename, filepath }) => {
    // skip empty filepath
    if (!filepath) {
      return;
    }
  
    const components_file = (await axios.get('/public/raw/ui-components', { baseURL, params: { unique_id, filename, semantic_versioning } })).data;
    console.log(`Writing component "${filename}" to "${filepath}"...`);
    await fsPromise.writeFile(`./${filepath}`, components_file);
  }));
}

async function getUiPageFiles(base_url: string, unique_id: string, list_page: FileItem[], semantic_versioning?: string) {
  const baseURL = base_url;
  await fsPromise.mkdir("./src/pages", { recursive: true });

  const files = await fg("./src/pages/*.tsx");
  await Promise.all(files.map(file => fsPromise.rm(file, { force: true })));

  const list_pages_data: string[][] = [];
  await Promise.all(list_page.map(async ({ filename, filepath }, i: number) => {
    const regex = /^(.*?)\s+\((\/[^\)]*)\)$/;
    const match = filename.match(regex);
    if (match) {
      const page_name = match[1];
      const url = match[2];
      const pages_file = (await axios.get('/public/raw/ui-pages', { baseURL, params: { unique_id, filename, semantic_versioning } })).data;
      console.log(`Writing page "${filename}" to "${filepath}"...`);
      await fsPromise.writeFile(`./${filepath}`, pages_file);
      list_pages_data.push([url, `P${i + 1}`, filepath, page_name]);
    }
  }))

  list_pages_data.sort(([a_url], [b_url]) => a_url.localeCompare(b_url));

  await fsPromise.writeFile('./src/main.tsx', `\
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
${list_pages_data.map(([url, page_jsx, filename_final, description]) => `import ${page_jsx} from '../${filename_final}';`).join('\n')}

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={createBrowserRouter([
${list_pages_data.map(([url, page_jsx, filename_final, description]) => [`      // [${filename_final}] ${description}`, `      { path: "${url}", element: <${page_jsx} /> },`].join('\n')).join('\n')}
    ])} />
    <Toaster />
  </>
);
`)
}

async function fetch_data(baseURL: string, unique_id: string, semantic_versioning?: string) {
  const page_components_data: { components: FileItem[], pages: FileItem[] } = (await axios.get('/public/page-component-data', { baseURL, params: { unique_id, semantic_versioning } })).data;
  await Promise.all([
    await getUiComponentFiles(baseURL, unique_id, page_components_data.components, semantic_versioning),
    await getUiPageFiles(baseURL, unique_id, page_components_data.pages, semantic_versioning)
  ]);
}

// @ts-ignore
const argv: any = process.argv;

if (argv[2] && argv[3]) {
  fetch_data(argv[2], argv[3], argv[4] as string | undefined);
} else {
  throw new Error(`argv[2] is required (baseURL); argv[3] is required (unique_id)`);
}
