import type { BaseClass } from './base_class';

export interface Settings extends BaseClass {
    instituteName: string;
    instituteType: string;
    instituteId: string;
    stds: string[];
    slots: string[];
    currentYear: number;
}
