import {Resource, ResourceConstructors} from './resources/resource'
import {State} from './terraform/state'
import {Id} from './terraform/schema'
import {Config} from './yaml/config'

export async function sync(state: State, config: Config): Promise<void> {
  const resources: [Id, Resource][] = []
  for (const resourceClass of ResourceConstructors) {
    const oldResources = config.getResources(resourceClass)
    const newResources = await resourceClass.FromGitHub(oldResources)
    resources.push(...newResources)
  }

  await state.sync(resources)
  await state.refresh()

  const syncedResources = []
  for (const resourceClass of ResourceConstructors) {
    syncedResources.push(...state.getResources(resourceClass))
  }

  config.sync(syncedResources)
}
