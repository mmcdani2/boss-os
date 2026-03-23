export type ModuleKey =
  | 'refrigerant-log'
  | 'quick-estimate-calculator'
  | 'reimbursement-request'
  | 'spray-foam-job-log'
  | 'my-refrigerant-logs'

type ModuleContext = {
  moduleKey: ModuleKey
  divisionKey: 'hvac' | 'spray-foam'
  companyKey: 'urban-mechanical' | 'urban-spray-foam'
  returnPath: string
  returnLabel: string
  pageLabel: string
}

export function getModuleContext (
  moduleKey: ModuleKey,
  divisionKey?: string
): ModuleContext {
  if (moduleKey === 'spray-foam-job-log') {
    return {
      moduleKey,
      divisionKey: 'spray-foam',
      companyKey: 'urban-spray-foam',
      returnPath: '/division/spray-foam',
      returnLabel: 'Back to Spray Foam Modules',
      pageLabel: 'Spray Foam Job Log'
    }
  }

  if (moduleKey === 'reimbursement-request') {
    if (divisionKey === 'spray-foam') {
      return {
        moduleKey,
        divisionKey: 'spray-foam',
        companyKey: 'urban-spray-foam',
        returnPath: '/division/spray-foam',
        returnLabel: 'Back to Spray Foam Modules',
        pageLabel: 'Reimbursement Request'
      }
    }

    return {
      moduleKey,
      divisionKey: 'hvac',
      companyKey: 'urban-mechanical',
      returnPath: '/division/hvac',
      returnLabel: 'Back to HVAC Modules',
      pageLabel: 'Reimbursement Request'
    }
  }

  if (moduleKey === 'my-refrigerant-logs') {
    return {
      moduleKey,
      divisionKey: 'hvac',
      companyKey: 'urban-mechanical',
      returnPath: '/division/hvac',
      returnLabel: 'Back to HVAC Modules',
      pageLabel: 'My Refrigerant Logs'
    }
  }

  return {
    moduleKey,
    divisionKey: 'hvac',
    companyKey: 'urban-mechanical',
    returnPath: '/division/hvac',
    returnLabel: 'Back to HVAC Modules',
    pageLabel:
      moduleKey === 'quick-estimate-calculator'
        ? 'Quick Estimate Calculator'
        : 'Refrigerant Log'
  }
}