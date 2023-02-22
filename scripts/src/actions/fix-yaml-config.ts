import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {addFileToAllRepos} from './shared/add-file-to-all-repos'
import {format} from './shared/format'

// exclude fclibp2p-zhi because it is not initialised
addFileToAllRepos(
  '.github/workflows/stale.yml',
  '.github/workflows/stale.yml',
  (repository: Repository) => repository.name !== 'fclibp2p-zhi'
)
addFileToAllRepos(
  '.github/workflows/action-semantic-pull-request.yml',
  '.github/workflows/action-semantic-pull-request.yml',
  (repository: Repository) => (repository.name.startsWith('js-libp2p')
                                || repository.name == 'go-libp2p'
                                || repository.name == 'rust-libp2p')
)
format()
