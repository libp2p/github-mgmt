import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {addFileToAllRepos} from './shared/add-file-to-all-repos'
import {format} from './shared/format'
import {setPropertyInAllRepos} from './shared/set-property-in-all-repos'

function isInitialised(repository: Repository) {
  return ![
    'fclibp2p-zhi',
    'okr-temp',
    'governance'
  ].includes(repository.name)
}

function isJS(repository: Repository) {
  return repository.name.startsWith('js-libp2p')
}

function isPublic(repository: Repository) {
  return repository.visibility === 'public'
}

addFileToAllRepos(
  '.github/workflows/stale.yml',
  '.github/workflows/stale.yml',
  isInitialised
)
addFileToAllRepos(
  '.github/workflows/semantic-pull-request.yml',
  '.github/workflows/semantic-pull-request.yml',
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
