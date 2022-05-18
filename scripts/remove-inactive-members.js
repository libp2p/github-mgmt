#!/usr/bin/env bash
":" //# comment; exec /usr/bin/env node --input-type=module - "$@" < "$0"

import { writeFileSync, readFileSync } from 'fs';

const __dirname = process.cwd();
const args = process.argv.slice(2);

const auditLogFilePath = args[0];
const auditLog = JSON.parse(readFileSync(auditLogFilePath));

const cutoffDate = new Date();
cutoffDate.setMonth(cutoffDate.getMonth() - 12);

const membershipFilePath = `${__dirname}/github/libp2p/membership.json`;
const membership = JSON.parse(readFileSync(membershipFilePath));
const repositoryCollaboratorFilePath = `${__dirname}/github/libp2p/repository_collaborator.json`;
const repositoryCollaborator = JSON.parse(readFileSync(repositoryCollaboratorFilePath));
const teamFilePath = `${__dirname}/github/libp2p/team.json`;
const team = JSON.parse(readFileSync(teamFilePath));
const teamMembershipFilePath = `${__dirname}/github/libp2p/team_membership.json`;
const teamMembership = JSON.parse(readFileSync(teamMembershipFilePath));
const teamRepositoryFilePath = `${__dirname}/github/libp2p/team_repository.json`;
const teamRepository = JSON.parse(readFileSync(teamRepositoryFilePath));

for (const [name, _config] of Object.entries(membership)) {
  const recentActivity = auditLog.find(activity => {
    const createdAt = new Date(activity.created_at);
    return activity.actor == name && createdAt >= cutoffDate;
  })
  if (recentActivity === undefined) {
    console.log(`Didn't find any recent activity for ${name}. Removing ${name} from the organization.`)
    delete membership[name]
  }
}

for (const [repositoryName, repositoryCollaborators] of Object.entries(repositoryCollaborator)) {
  for (const [userName, _config] of Object.entries(repositoryCollaborators)) {
    const recentActivity = auditLog.find(activity => {
      const createdAt = new Date(activity.created_at);
      return activity.actor == userName && activity.repo == `libp2p/${repositoryName}` && createdAt >= cutoffDate;
    })
    if (recentActivity === undefined) {
      console.log(`Didn't find any recent activity for ${userName} in ${repositoryName}. Removing ${userName} from ${repositoryName}.`)
      delete repositoryCollaborator[repositoryName][userName];
    }
  }
  if (Object.keys(repositoryCollaborator[repositoryName]).length === 0) {
    console.log(`There are no users left in ${repositoryName}. Removing ${repositoryName}.`)
    delete repositoryCollaborator[repositoryName];
  }
}

for (const [teamName, teamMembers] of Object.entries(teamMembership)) {
  const repositories = Object.keys(teamRepository[teamName] ?? {}).map(name => {
    return `libp2p/${name}`
  });
  for (const [userName, _config] of Object.entries(teamMembers)) {
    const recentActivity = auditLog.find(activity => {
      const createdAt = new Date(activity.created_at);
      return activity.actor == userName && repositories.includes(activity.repo) && createdAt >= cutoffDate;
    })
    if (recentActivity === undefined) {
      console.log(`Didn't find any recent activity for ${userName} in any of the repositories belonging to ${teamName}. Removing ${userName} from ${teamName}.`)
      delete teamMembership[teamName][userName];
    }
  }
  if (Object.keys(teamMembership[teamName]).length === 0) {
    console.log(`There are no members left in ${teamName}. Removing ${teamName}.`)
    delete team[teamName];
    delete teamMembership[teamName];
    delete teamRepository[teamName];
  }
}

writeFileSync(membershipFilePath, `${JSON.stringify(membership, null, 2)}\n`);
writeFileSync(repositoryCollaboratorFilePath, `${JSON.stringify(repositoryCollaborator, null, 2)}\n`);
writeFileSync(teamFilePath, `${JSON.stringify(team, null, 2)}\n`);
writeFileSync(teamMembershipFilePath, `${JSON.stringify(teamMembership, null, 2)}\n`);
writeFileSync(teamRepositoryFilePath, `${JSON.stringify(teamRepository, null, 2)}\n`);
