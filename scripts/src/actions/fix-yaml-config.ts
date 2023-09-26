import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {addFileToAllRepos} from './shared/add-file-to-all-repos'
import {format} from './shared/format'
import {setPropertyInAllRepos} from './shared/set-property-in-all-repos'

function isInitialised(repository: Repository) {
  return ![
    'fclibp2p-zhi',
    'okr-temp',
    'governance',
    'product'
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

addFileToAllRepos(
  '.github/workflows/stale.yml',
  '.github/workflows/stale.yml',
  r => isInitialised(r) && !isFork(r)
)
addFileToAllRepos(
  '.github/workflows/semantic-pull-request.yml',
  '.github/workflows/semantic-pull-request.yml',
  r => isInitialised(r) && isJS(r)
)
addFileToAllRepos(
  '.github/pull_request_template.md',
  '.github/js_pull_request_template.md',
  r => isInitialised(r) && isJS(r)
)
setPropertyInAllRepos(
  'secret_scanning',
  true,
  r => isInitialised(r) && isPublic(r)
)
setPropertyInAllRepos(
  'secret_scanning_push_protection',
  true,
  r => isInitialised(r) && isPublic(r)
)
format()
