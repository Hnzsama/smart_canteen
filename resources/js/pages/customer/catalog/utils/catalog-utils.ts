import { GlobalCategoryKey } from '../components/global-category-chips';
import { MenuItem, TimeMode } from '../types';

export function detectInitialTimeMode(): TimeMode {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'pagi';
    if (hour >= 11 && hour < 15) return 'siang';
    if (hour >= 15 && hour < 18) return 'sore';
    return 'malam';
}

export function matchGlobalCategory(menu: MenuItem, selectedGlobalCategory: GlobalCategoryKey): boolean {
    if (selectedGlobalCategory === 'all') return true;

    const name = menu.name.toLowerCase();
    const desc = (menu.description || '').toLowerCase();
    const cat = (menu.category_name || '').toLowerCase();
    const corpus = `${name} ${desc} ${cat}`;

    if (selectedGlobalCategory === 'makanan') {
        return (
            cat.includes('makanan') ||
            corpus.includes('nasi') ||
            corpus.includes('ayam') ||
            corpus.includes('mie') ||
            corpus.includes('geprek') ||
            corpus.includes('bakso') ||
            corpus.includes('padang') ||
            corpus.includes('soto') ||
            corpus.includes('rendang') ||
            corpus.includes('gulai') ||
            corpus.includes('bebek') ||
            corpus.includes('ikan') ||
            corpus.includes('sate')
        );
    }

    if (selectedGlobalCategory === 'minuman') {
        return (
            cat.includes('minuman') ||
            corpus.includes('es') ||
            corpus.includes('jus') ||
            corpus.includes('teh') ||
            corpus.includes('kopi') ||
            corpus.includes('boba') ||
            corpus.includes('susu') ||
            corpus.includes('air') ||
            corpus.includes('drink') ||
            corpus.includes('soda') ||
            corpus.includes('smoothie')
        );
    }

    if (selectedGlobalCategory === 'snack') {
        return (
            cat.includes('snack') ||
            cat.includes('cemilan') ||
            corpus.includes('pisang') ||
            corpus.includes('roti') ||
            corpus.includes('dimsum') ||
            corpus.includes('siomay') ||
            corpus.includes('cireng') ||
            corpus.includes('gorengan') ||
            corpus.includes('kentang') ||
            corpus.includes('snack')
        );
    }

    if (selectedGlobalCategory === 'dessert') {
        return (
            cat.includes('dessert') ||
            corpus.includes('manis') ||
            corpus.includes('es krim') ||
            corpus.includes('pudding') ||
            corpus.includes('puding') ||
            corpus.includes('cokelat') ||
            corpus.includes('cake') ||
            corpus.includes('waffle') ||
            corpus.includes('donut')
        );
    }

    if (selectedGlobalCategory === 'sarapan') {
        return (
            cat.includes('sarapan') ||
            corpus.includes('bubur') ||
            corpus.includes('lontong') ||
            corpus.includes('uduk') ||
            corpus.includes('roti') ||
            corpus.includes('telur')
        );
    }

    if (selectedGlobalCategory === 'kopi') {
        return (
            cat.includes('kopi') ||
            corpus.includes('kopi') ||
            corpus.includes('coffee') ||
            corpus.includes('latte') ||
            corpus.includes('espresso') ||
            corpus.includes('teh') ||
            corpus.includes('matcha')
        );
    }

    return true;
}

export function areChoicesEqual(
    c1: Record<string, { name: string; price: number }>,
    c2: Record<string, { name: string; price: number }>
): boolean {
    const keys1 = Object.keys(c1 || {});
    const keys2 = Object.keys(c2 || {});
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
        if (!c2[key] || c1[key].name !== c2[key].name) return false;
    }
    return true;
}
