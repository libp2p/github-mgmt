import 'reflect-metadata'
import {Repository} from '../resources/repository.js'
import {runAddLabelToAllRepos} from './shared/add-label-to-all-repos.js'

runAddLabelToAllRepos(
  'need/author-input',
  'ededed',
  'Needs input from the original author',
  (repository: Repository) => repository.name !== 'fclibp2p-zhi'
)
