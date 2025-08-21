import { SHEET_CFG, ss, v, num } from "./utils";

export interface PanelConfig {
  dealId?: string;
  quoteNumber?: string;
  customerCompany?: string;
  customerContact?: string;
  projectName?: string;
  panelType?: string;
  platform?: string;
  serviceVoltage?: string;
  phase?: string;
  controlVoltage?: string;
  ul?: string;
  sccr?: string;
  disconnect?: string;
  enclosureCfg?: string;
  hmiSize?: string;
  motors?: number;
  heaters?: number;
  valves?: number;
  sensors?: number;
  isAutomated?: boolean;
  certUL?: boolean;
}

export function getConfig(): PanelConfig {
  const sh = ss(SHEET_CFG);
  const cfg: PanelConfig = {
    dealId:          v(sh,'B2'),
    quoteNumber:     v(sh,'B3'),
    customerCompany: v(sh,'B4'),
    customerContact: v(sh,'B5'),
    projectName:     v(sh,'B6'),
    panelType:       v(sh,'B7'),
    platform:        v(sh,'B8'),
    serviceVoltage:  v(sh,'B9'),
    phase:           v(sh,'B10'),
    controlVoltage:  v(sh,'B11'),
    ul:              v(sh,'B12'),
    sccr:            v(sh,'B13'),
    disconnect:      v(sh,'B14'),
    enclosureCfg:    v(sh,'B15'),
    hmiSize:         v(sh,'B16'),
    motors:          num(v(sh,'B17')),
    heaters:         num(v(sh,'B18')),
    valves:          num(v(sh,'B19')),
    sensors:         num(v(sh,'B20'))
  };
  cfg.isAutomated = (cfg.panelType || '').toUpperCase().endsWith('AC');
  cfg.certUL = (cfg.ul || '').toLowerCase() === 'yes';
  return cfg;
}

export function validateConfig(): string[] {
  const c = getConfig();
  const errs: string[] = [];
  if (!c.quoteNumber) errs.push('Quote_Number');
  ['panelType','serviceVoltage','phase','controlVoltage','disconnect'].forEach((k: any)=> { // @ts-ignore
    if (!c[k]) errs.push(k);
  });
  if (c.isAutomated && !c.platform) errs.push('platform (required for Automated)');
  return errs;
}
