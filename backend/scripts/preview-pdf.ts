import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { BookingsService } from '../src/bookings/bookings.service';
import { QuotationsService } from '../src/quotations/quotations.service';

async function main() {
  console.log('Generating sample PDFs for development preview...');

  const bookingsService = new BookingsService(null as any, null as any, null as any);
  const quotationsService = new QuotationsService(null as any, null as any, null as any);

  const resPath = await bookingsService.generateSamplePdf();
  console.log(`✓ Reservation sample generated at: ${resPath}`);

  const quotPath = await quotationsService.generateSamplePdf();
  console.log(`✓ Quotation sample generated at: ${quotPath}`);

  // Auto open on Windows
  if (process.platform === 'win32') {
    exec(`start "" "${resPath}"`);
    exec(`start "" "${quotPath}"`);
  } else if (process.platform === 'darwin') {
    exec(`open "${resPath}"`);
    exec(`open "${quotPath}"`);
  } else {
    exec(`xdg-open "${resPath}"`);
    exec(`xdg-open "${quotPath}"`);
  }

  console.log('Opened sample PDFs in default viewer.');
}

main().catch((err) => {
  console.error('Error generating preview PDFs:', err);
});
