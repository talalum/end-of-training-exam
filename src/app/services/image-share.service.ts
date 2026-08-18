import { Injectable } from '@angular/core';

export type ImageShareResult = 'shared' | 'cancelled' | 'failed';

@Injectable({ providedIn: 'root' })
export class ImageShareService {
  /** האם הדפדפן/המכשיר תומכים בשיתוף קבצים אמיתי (בעיקר דפדפני מובייל). */
  isImageShareSupported(): boolean {
    if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
      return false;
    }
    try {
      const dummy = new File([new Uint8Array([1])], 'test.png', { type: 'image/png' });
      return navigator.canShare({ files: [dummy] });
    } catch {
      return false;
    }
  }

  async renderElementToFile(el: HTMLElement, filename: string): Promise<File> {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: Math.min(2, window.devicePixelRatio || 1),
    });
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('כשל ביצירת התמונה');
    }
    return new File([blob], filename, { type: 'image/png' });
  }

  async shareImageFile(file: File, title: string, text: string): Promise<ImageShareResult> {
    try {
      await navigator.share({ files: [file], title, text });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled';
      }
      return 'failed';
    }
  }
}
