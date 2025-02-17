import { extname, parseYaml, YAMLError } from "../../deps.ts";

import { DENO_WORKSPACE_FILES } from "../const.ts";
import { DenoWorkspace } from "../interfaces.ts";

import { getFileContent, getFirstExistingPath } from "../utils/file.ts";
import {
  WorkspaceFileIsMalformed,
  WorkspaceNotFoundError,
} from "../utils/DenoXErrors.ts";

async function loadDenoWorkspace(): Promise<DenoWorkspace> {
  try {
    const denoWorkspaceFilePath = await getFirstExistingPath(
      DENO_WORKSPACE_FILES,
    );

    if (extname(denoWorkspaceFilePath) === ".ts") {
      return await _loadTSWorkspace("file:///" + denoWorkspaceFilePath);
    }

    return await _loadYAMLWorkspace(denoWorkspaceFilePath) as DenoWorkspace;
  } catch (e) {
    throw _handleLoadDenoWorkspaceErrors(e);
  }
}

async function _loadTSWorkspace(
  denoWorkspaceFilePath: string,
): Promise<DenoWorkspace> {
  const { workspace } = await import(denoWorkspaceFilePath) as {
    workspace: DenoWorkspace;
  };
  return workspace;
}

async function _loadYAMLWorkspace(
  denoWorkspaceFilePath: string,
): Promise<DenoWorkspace> {
  const denoWorkspaceFileContent = await getFileContent(
    denoWorkspaceFilePath,
  );
  return parseYaml(denoWorkspaceFileContent) as DenoWorkspace;
}

function _handleLoadDenoWorkspaceErrors(e: unknown): Error {
  if (e instanceof Deno.errors.NotFound) {
    return new WorkspaceNotFoundError();
  }

  if (
    e instanceof YAMLError || e instanceof ReferenceError ||
    e instanceof TypeError
  ) {
    return new WorkspaceFileIsMalformed(e.message);
  }

  return e as Error;
}

export { loadDenoWorkspace };
