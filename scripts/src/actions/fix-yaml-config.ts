import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {addFileToAllRepos} from './shared/add-file-to-all-repos'
import {format} from './shared/format'
import {setPropertyInAllRepos} from './shared/set-property-in-all-repos'
import {toggleArchivedRepos} from './shared/toggle-archived-repos'
import {describeAccessChanges} from './shared/describe-access-changes'

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
  await addFileToAllRepos(
    '.github/workflows/stale.yml',
    '.github/workflows/stale.yml',
    r => isInitialised(r) && !isFork(r)
  )
  await addFileToAllRepos(
    '.github/workflows/semantic-pull-request.yml',
    '.github/workflows/semantic-pull-request.yml',
    r => isInitialised(r) && isJS(r)
  )
  await addFileToAllRepos(
    '.github/pull_request_template.md',
    '.github/js_pull_request_template.md',
    r => isInitialised(r) && isJS(r)
  )
  await setPropertyInAllRepos(
    'secret_scanning',
    true,
    r => isInitialised(r) && isPublic(r)
  )
  await setPropertyInAllRepos(
    'secret_scanning_push_protection',
    true,
    r => isInitialised(r) && isPublic(r)
  )
  await toggleArchivedRepos()
  const accessChangesDescription = await describeAccessChanges()
  core.setOutput(
    'comment',
    `The following access changes will be introduced as a result of applying the plan:

<details><summary>Access Changes</summary>

\`\`\`
${accessChangesDescription}
\`\`\`

</details>`
  )
  format()
}

run()
