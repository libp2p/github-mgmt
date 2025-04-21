import 'reflect-metadata'
import {Permission} from '../resources/repository-collaborator.js'
import {Repository} from '../resources/repository.js'
import {runFormat} from './shared/format.js'
import {runAddFileToAllRepos} from './shared/add-file-to-all-repos.js'
import {runSetPropertyInAllRepos} from './shared/set-property-in-all-repos.js'
import {runToggleArchivedRepos} from './shared/toggle-archived-repos.js'
import {runDescribeAccessChanges} from './shared/describe-access-changes.js'

import * as core from '@actions/core'

function isInitialised(repository: Repository) {
  return ![
    'core-fund',
    'fclibp2p-zhi',
    'foundation',
    'okr-temp',
    'governance',
    'product',
    'rust-libp2p-identity',
    'test',
    'credits'
  ].includes(repository.name)
}

function isJS(repository: Repository) {
  return repository.name.startsWith('js-libp2p') || ['interop'].includes(repository.name)
}

function isPublic(repository: Repository) {
  return repository.visibility === 'public'
}

function isFork(repository: Repository) {
  return [
    'uci'
  ].includes(repository.name)
}

async function run() {
  await runAddFileToAllRepos(
    '.github/pull_request_template.md',
    '.github/js_pull_request_template.md',
    r => isInitialised(r) && isJS(r)
  )
  await runSetPropertyInAllRepos(
    'secret_scanning',
    true,
    r => isInitialised(r) && isPublic(r)
  )
  await runSetPropertyInAllRepos(
    'secret_scanning_push_protection',
    true,
    r => isInitialised(r) && isPublic(r)
  )
  await runToggleArchivedRepos()
  const accessChangesDescription = await runDescribeAccessChanges()
  core.setOutput(
    'comment',
    `The following access changes will be introduced as a result of applying the plan:

<details><summary>Access Changes</summary>

\`\`\`
${accessChangesDescription}
\`\`\`

</details>`
  )
  runFormat()
}

run()
