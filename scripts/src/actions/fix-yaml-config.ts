import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {addFileToAllRepos} from './shared/add-file-to-all-repos'
import {format} from './shared/format'

// exclude fclibp2p-zhi because it is not initialised
const uninitialisedRepos = [
  'fclibp2p-zhi',
  'universal-connectivity'
]
addFileToAllRepos(
  '.github/workflows/stale.yml',
  '.github/workflows/stale.yml',
  (repository: Repository) => !uninitialisedRepos.includes(repository.name)
)
addFileToAllRepos(
  '.github/workflows/semantic-pull-request.yml',
  '.github/workflows/semantic-pull-request.yml',
  (repository: Repository) => repository.name.startsWith('js-libp2p')
)
format()
