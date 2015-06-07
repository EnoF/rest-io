declare function featureFile(file: any, forFile: (feature: any) => void);
declare function scenarios(scenarios: Array<string>,
  forScenario: (scenario: any, done: () => void) => void);
declare function steps(steps: Array<string>,
  forStep: (step: string, done: () => void) => void);
