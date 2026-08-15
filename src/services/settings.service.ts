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
        bankAccounts: [],
      });
    }

    // Auto-migrate single bankDetails to bankAccounts if bankAccounts is empty and bankDetails has information
    if (
      (!settings.bankAccounts || settings.bankAccounts.length === 0) &&
      settings.bankDetails &&
      (settings.bankDetails.bankName || settings.bankDetails.accountNumber || settings.bankDetails.upiId || settings.bankDetails.accountName)
    ) {
      settings.bankAccounts = [
        {
          id: settings.bankDetails.id || 'bank-1',
          accountLabel: settings.bankDetails.accountLabel || 'Primary Bank Account',
          bankName: settings.bankDetails.bankName,
          accountName: settings.bankDetails.accountName,
          accountNumber: settings.bankDetails.accountNumber,
          ifscCode: settings.bankDetails.ifscCode,
          upiId: settings.bankDetails.upiId,
          swiftCode: settings.bankDetails.swiftCode,
          accountType: settings.bankDetails.accountType || 'Current',
          isPrimary: true,
        },
      ];
      await Settings.updateOne({ _id: settings._id }, { $set: { bankAccounts: settings.bankAccounts } });
    }

    return settings;
  }

  /**
   * Validate with Zod and update agency settings.
   */
  static async updateSettings(data: UpdateSettingsInput): Promise<ISettings> {
    await connectToDatabase();

    // If bankAccounts is provided, sync the primary/first one to bankDetails
    if (data.bankAccounts && data.bankAccounts.length > 0) {
      const primaryAccount = data.bankAccounts.find((b) => b.isPrimary) || data.bankAccounts[0];
      data.bankDetails = {
        id: primaryAccount.id || undefined,
        accountLabel: primaryAccount.accountLabel || undefined,
        bankName: primaryAccount.bankName || undefined,
        accountName: primaryAccount.accountName || undefined,
        accountNumber: primaryAccount.accountNumber || undefined,
        ifscCode: primaryAccount.ifscCode || undefined,
        upiId: primaryAccount.upiId || undefined,
        swiftCode: primaryAccount.swiftCode || undefined,
        accountType: primaryAccount.accountType || 'Current',
        isPrimary: true,
      };
    }

    const validatedData = updateSettingsSchema.parse(data);

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: validatedData },
      { new: true, upsert: true, runValidators: true }
    );

    return settings!;
  }
}

