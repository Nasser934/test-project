import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { EncryptionService } from './encryption.service';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json';
  template: string;
  language: 'ar' | 'en';
  includePhoto: boolean;
  encrypt: boolean;
}

export class ExportService {
  static async exportCV(cvData: any, options: ExportOptions): Promise<void> {
    let result: Blob;

    if (options.encrypt) {
      cvData = EncryptionService.encrypt(cvData);
    }

    switch (options.format) {
      case 'pdf':
        result = await this.exportToPDF(cvData, options);
        break;
      case 'docx':
        result = await this.exportToDOCX(cvData, options);
        break;
      case 'html':
        result = await this.exportToHTML(cvData, options);
        break;
      case 'json':
        result = await this.exportToJSON(cvData, options);
        break;
      default:
        throw new Error('تنسيق غير مدعوم');
    }

    const fileName = `cv-${Date.now()}.${options.format}`;
    saveAs(result, fileName);
  }

  private static async exportToPDF(cvData: any, options: ExportOptions): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    });

    // إضافة دعم للغة العربية
    if (options.language === 'ar') {
      doc.addFont('path/to/arabic-font.ttf', 'Arabic', 'normal');
      doc.setFont('Arabic');
      doc.setR2L(true);
    }

    // تحويل البيانات إلى HTML
    const html = await this.renderTemplate(cvData, options.template);
    const canvas = await html2canvas(html as unknown as HTMLElement);
    const imgData = canvas.toDataURL('image/png');

    doc.addImage(imgData, 'PNG', 0, 0, 210, 297);

    return doc.output('blob');
  }

  private static async exportToHTML(cvData: any, options: ExportOptions): Promise<Blob> {
    const html = await this.renderTemplate(cvData, options.template);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    return blob;
  }

  private static async exportToJSON(cvData: any, options: ExportOptions): Promise<Blob> {
    const json = JSON.stringify(cvData, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    return blob;
  }

  private static async exportToDOCX(cvData: any, options: ExportOptions): Promise<Blob> {
    // استخدام مكتبة docx لإنشاء ملف Word
    // تنفيذ التصدير إلى DOCX
    throw new Error('لم يتم تنفيذ التصدير إلى DOCX بعد');
  }

  private static async renderTemplate(cvData: any, templateName: string): Promise<string> {
    // تحميل القالب وتطبيق البيانات
    const template = await this.loadTemplate(templateName);
    return this.applyDataToTemplate(template, cvData);
  }

  private static async loadTemplate(templateName: string): Promise<string> {
    // تحميل القالب من الملفات
    const response = await fetch(`/templates/${templateName}.html`);
    return response.text();
  }

  private static applyDataToTemplate(template: string, data: any): string {
    // استبدال المتغيرات في القالب بالبيانات الفعلية
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      return data[key.trim()] || '';
    });
  }
} 