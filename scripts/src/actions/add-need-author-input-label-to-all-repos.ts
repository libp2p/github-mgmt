import 'reflect-metadata'
import { Repository } from '../resources/repository'
import {addLabelToAllRepos} from './shared/add-label-to-all-repos'

addLabelToAllRepos(
  'need/author-input',
  'ededed',
  'Needs input from the original author',
  (repository: Repository) => repository.name !== 'fclibp2p-zhi'
)
