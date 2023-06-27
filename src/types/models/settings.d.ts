import type { BaseClass } from './base_class';

export interface Settings extends BaseClass {
    instituteName: string;
    instituteType: string;
    stds: string[];
    slots: string[];
}
