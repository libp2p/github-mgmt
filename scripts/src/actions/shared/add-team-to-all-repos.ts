import {Config} from '../../yaml/config.js'
import {Repository} from '../../resources/repository.js'
import * as core from '@actions/core'
import {
  Permission,
  RepositoryTeam
} from '../../resources/repository-team.js'

export async function runAddTeamToAllRepos(
  name: string,
  permission: Permission,
  repositoryFilter: (repository: Repository) => boolean = (): boolean => true
): Promise<void> {
  const config = Config.FromPath()

  await addTeamToAllRepos(
    config,
    name,
    permission,
    repositoryFilter
  )

  config.save()
}

export async function addTeamToAllRepos(
  config: Config,
  name: string,
  permission: Permission,
  repositoryFilter: (repository: Repository) => boolean = () => true
): Promise<void> {
  const collaborators = config
    .getResources(RepositoryTeam)
    .filter(c => c.team === name)

  const repositories = config
    .getResources(Repository)
    .filter(r => !r.archived)
    .filter(repositoryFilter)
    .filter(r => !collaborators.some(c => c.repository === r.name))

  for (const repository of repositories) {
    const collaborator = new RepositoryTeam(
      repository.name,
      name,
      permission
    )
    core.info(
      `Adding ${collaborator.team} as a team collaborator with ${collaborator.permission} access to ${collaborator.repository} repository`
    )
    config.addResource(collaborator)
  }
}
