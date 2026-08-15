import connectToDatabase from '@/lib/db';
import { Settings, ISettings } from '@/models';
import { updateSettingsSchema, UpdateSettingsInput } from '@/lib/validations';

export class SettingsService {
  /**
   * Fetch agency settings singleton or auto-create default document.
   */
  static async getSettings(): Promise<ISettings> {
    await connectToDatabase();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        agencyName: 'M.Div Softsolutions',
        defaultCurrency: 'INR',
        currencySymbol: '₹',
        invoicePrefix: 'MDIV-',
        defaultTaxRate: 18,
        bankDetails: {},
      });
    }
    return settings;
  }

  /**
   * Validate with Zod and update agency settings.
   */
  static async updateSettings(data: UpdateSettingsInput): Promise<ISettings> {
    await connectToDatabase();
    const validatedData = updateSettingsSchema.parse(data);

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(validatedData);
    } else {
      Object.assign(settings, validatedData);
      await settings.save();
    }

    return settings;
  }
}
