export const TIME_OUT = 10 * 1000
export const BASE_URL = process.env.BASE_URL || '/'

export enum WorkingStatus {
  Unknown = '',
  Student = 'Student',
  Working = 'Working',
  Others = 'Others'
}

export enum JobResearch {
  CTO = 'CTO',
  DBA = 'DBA',
  InfrastructureDevelopmentEngineer = 'Infrastructure Development Engineer',
  StorageEngineer = 'Storage Engineer',
  DistributedSystemDirection = 'Distributed System Direction',
  BigData = 'Big Data',
  Others = 'Others'
}

export const JobResearchOptions = {
  [WorkingStatus.Unknown]: Object.keys(JobResearch),
  [WorkingStatus.Student]: keys(JobResearch, [
    JobResearch.InfrastructureDevelopmentEngineer,
    JobResearch.StorageEngineer,
    JobResearch.DistributedSystemDirection,
    JobResearch.BigData,
    JobResearch.Others
  ]),
  [WorkingStatus.Working]: Object.keys(JobResearch),
  [WorkingStatus.Others]: Object.keys(JobResearch)
}

function keys<T>(t: {[key: string]: T}, vs: T[]): string[] {
  return Object.keys(t).filter(k => vs.includes(t[k]))
}
