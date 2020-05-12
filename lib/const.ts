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
  Others = 'Others'
}
