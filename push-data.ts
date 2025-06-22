// @ts-ignore
import fsPromise from 'fs/promises';
import axios from 'axios';
import fg from "fast-glob";

async function pushUiComponentFiles(base_url: string, unique_id: string, semantic_versioning?: string) {
  const baseURL = base_url;
  const files = await fg("src/components/*.tsx");
  await Promise.all(files.map(async (filepath: string) => {
    try {
      console.log(`Push endpoint "${filepath}...`);
      (await axios.post('/public/raw/ui-components', { filepath, data: await fsPromise.readFile(filepath, 'utf-8') }, { baseURL, params: { unique_id, semantic_versioning } })).data;
      console.log(`Push endpoint "${filepath} success`);
    } catch (err) {
      console.error(`[Error] push endpoint "${filepath}...`);
      console.error(err?.response?.data?.toString());
    }
  }))
}

async function pushUiPageFiles(base_url: string, unique_id: string, semantic_versioning?: string) {
  const baseURL = base_url;
  const files = await fg("src/pages/*.tsx");
  await Promise.all(files.map(async (filepath: string) => {
    try {
      console.log(`Push page "${filepath}...`);
      (await axios.post('/public/raw/ui-pages', { filepath, data: await fsPromise.readFile(filepath, 'utf-8') }, { baseURL, params: { unique_id, semantic_versioning } })).data;
      console.log(`Push page "${filepath} success`);
    } catch (err) {
      console.error(`[Error] push page "${filepath}...`);
      console.error(err?.response?.data?.toString());
    }
  }))
}

async function push_data(baseURL: string, unique_id: string, semantic_versioning?: string) {
  await pushUiComponentFiles(baseURL, unique_id, semantic_versioning);
  await pushUiPageFiles(baseURL, unique_id, semantic_versioning);
}

// @ts-ignore
const argv: any = process.argv;

if (argv[2] && argv[3]) {
  push_data(argv[2], argv[3], argv[4] as string | undefined);
} else {
  throw new Error(`argv[2] is required (baseURL); argv[3] is required (unique_id)`);
}
